import { Component, OnInit } from '@angular/core';
import { EyeCareTip } from '../../../../models/eye-care-tip.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EyeCareTipService } from '../../../services/eye-care-tip-service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Headercomponent } from '../../../shared/headercomponent/headercomponent';

@Component({
  selector: 'app-eye-care-tip-detail-component',
  standalone: true,
  imports: [CommonModule, RouterModule, Headercomponent],
  templateUrl: './eye-care-tip-detail-component.html',
  styleUrl: './eye-care-tip-detail-component.css',
})
export class EyeCareTipDetailComponent implements OnInit {

  tip$!: Observable<EyeCareTip>;

  constructor(
    private route: ActivatedRoute,
    private service: EyeCareTipService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tip$ = this.service.getById(id);
  }
}