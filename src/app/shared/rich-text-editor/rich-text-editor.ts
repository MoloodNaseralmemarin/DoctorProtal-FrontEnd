import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CKEditorModule, type ChangeEvent } from '@ckeditor/ckeditor5-angular';
import {
  Alignment,
  Autoformat,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Indent,
  Italic,
  Link,
  List,
  Paragraph,
  RemoveFormat,
  Strikethrough,
  Table,
  TableToolbar,
  Underline,
  Undo,
  type Editor,
  type EditorConfig,
} from 'ckeditor5';
import faTranslations from 'ckeditor5/translations/fa.js';
import { environment } from '../../../environments/environment';

/**
 * CKEditor returns this markup for an empty document. The forms treat an empty
 * body as invalid, so every variation has to collapse to an empty string.
 */
function normalizeEditorData(data: string | null | undefined): string {
  const value = (data ?? '').trim();

  if (!value) {
    return '';
  }

  const withoutEmptyBlocks = value
    // Internal bookkeeping attributes must not be persisted with the article.
    .replace(/\sdata-list-item-id="[^"]*"/g, '')
    .replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
    .replace(/<p><\/p>/gi, '')
    .trim();

  return withoutEmptyBlocks || '';
}

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CKEditorModule],
  templateUrl: './rich-text-editor.html',
  styleUrl: './rich-text-editor.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextEditorComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder = 'متن خود را وارد کنید...';

  @Input() minHeight = '16rem';

  protected readonly editor = ClassicEditor;

  protected config!: EditorConfig;

  private editorInstance: ClassicEditor | null = null;
  private pendingValue: string | null = null;
  private value = '';
  private disabled = false;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  private static readonly readOnlyLockId = 'app-rich-text-editor';

  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.config = {
      // CKEditor 5 requires a license key. This project uses the self-hosted
      // open-source distribution, which is licensed under GPL-2.0-or-later.
      licenseKey: environment.ckeditorLicenseKey || 'GPL',
      plugins: [
        Alignment,
        Autoformat,
        BlockQuote,
        Bold,
        Essentials,
        Heading,
        Indent,
        Italic,
        Link,
        List,
        Paragraph,
        RemoveFormat,
        Strikethrough,
        Table,
        TableToolbar,
        Underline,
        Undo,
      ],
      language: {
        ui: 'fa',
        content: 'fa',
      },
      translations: [faTranslations],
      placeholder: this.placeholder,
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'alignment',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'outdent',
          'indent',
          '|',
          'link',
          'blockQuote',
          'insertTable',
          '|',
          'removeFormat',
        ],
      },
      heading: {
        options: [
          { model: 'paragraph', title: 'پاراگراف', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h2', title: 'سرتیتر ۱', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h3', title: 'سرتیتر ۲', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h4', title: 'سرتیتر ۳', class: 'ck-heading_heading3' },
        ],
      },
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
      },
    };
  }

  writeValue(value: string | null): void {
    const next = value ?? '';
    this.value = next;

    if (!this.editorInstance) {
      // The editor may not exist yet (first render). Apply the value on ready.
      this.pendingValue = next;
      return;
    }

    if (next !== normalizeEditorData(this.editorInstance.getData())) {
      this.editorInstance.data.set(next);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;

    if (this.editorInstance) {
      this.applyDisabledState(this.editorInstance);
    }
  }

  protected onReady(editor: Editor): void {
    const instance = editor as ClassicEditor;
    this.editorInstance = instance;
    this.applyDisabledState(instance);

    const initial = this.pendingValue ?? this.value;
    this.pendingValue = null;

    if (initial && initial !== normalizeEditorData(instance.getData())) {
      instance.data.set(initial);
    }
  }

  /**
   * CKEditor 5 has no `isReadOnly` setter; read-only is a stack of named locks.
   */
  private applyDisabledState(editor: ClassicEditor): void {
    if (this.disabled && !editor.isReadOnly) {
      editor.enableReadOnlyMode(RichTextEditorComponent.readOnlyLockId);
    } else if (!this.disabled && editor.isReadOnly) {
      editor.disableReadOnlyMode(RichTextEditorComponent.readOnlyLockId);
    }
  }

  protected onEditorChange(event: ChangeEvent): void {
    const value = normalizeEditorData(event.editor.getData());

    // CKEditor reports the same data it was given when `data.set()` is called,
    // so only forward real edits to the form model.
    if (value === this.value) {
      return;
    }

    this.value = value;
    this.onChange(value);
    // The editor emits outside of Angular's zone; zoneless apps need an
    // explicit notification so parent bindings (e.g. live previews) refresh.
    this.cdr.markForCheck();
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
