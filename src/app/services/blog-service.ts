import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Blog } from '../../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {

  private baseUrl = `${environment.apiUrl}/admin/BlogAdmin`;

  constructor(private http: HttpClient) {}

  // لیست + سرچ + صفحه بندی
  getAll(
    pageNumber: number = 1,
    pageSize: number = 10,
    title?: string
  ): Observable<any> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (title) {
      params = params.set('title', title);
    }

    return this.http.get<any>(
      `${this.baseUrl}/Index`,
      { params }
    );
  }

  // دریافت یک رکورد
  getById(id: number): Observable<Blog> {
    return this.http.get<Blog>(
      `${this.baseUrl}/Edit/${id}`
    );
  }

  // ثبت
create(model: Partial<Blog>): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/Create`,
    model
  );
}
//ویرایش
update(id: number, model: Partial<Blog>): Observable<any> {
  return this.http.put(
    `${this.baseUrl}/Edit/${id}`,
    model
  );
}

  // حذف
  delete(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/Delete/${id}`
    );
  }

  // سرچ بر اساس عنوان
  searchByTitle(
    title: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any> {

    return this.getAll(
      pageNumber,
      pageSize,
      title
    );
  }
}