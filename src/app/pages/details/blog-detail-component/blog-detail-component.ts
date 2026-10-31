import { Component, OnInit } from '@angular/core';
import { Blog } from '../../../../models/blog.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog-service';
import { CommonModule } from '@angular/common';
import { Headercomponent } from '../../../shared/headercomponent/headercomponent';

@Component({
  selector: 'app-blog-detail-component',
  standalone:true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail-component.html',
  styleUrl: './blog-detail-component.css',
})
export class BlogDetailComponent implements OnInit {

  blog$!: Observable<Blog>;

  constructor(
    private route: ActivatedRoute,
    private service: BlogService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.blog$ = this.service.getById(id);
  }
}
