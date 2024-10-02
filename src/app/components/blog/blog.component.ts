import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Observable, catchError, of } from 'rxjs';
import { BlogPost } from '../../models/Blog';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  blogPosts$: Observable<BlogPost[]> | undefined;
  loading: boolean = true;
  error: string | undefined;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogPosts$ = this.blogService.getPosts().pipe(
      catchError((err) => {
        this.error = 'Error loading posts. Please try again later.';
        console.error(err);
        return of([]);
      })
    );

    this.blogPosts$.subscribe(() => {
      this.loading = false;
    });
  }

  deletePost(id: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService
        .deletePost(id)
        .then(() => {
          console.log('Post deleted!');
        })
        .catch((err) => {
          this.error = 'Error deleting post. Please try again later.';
          console.error(err);
        });
    }
  }
}
