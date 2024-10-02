import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Observable, catchError, map, of } from 'rxjs';
import { BlogPost } from '../../models/Blog';
import firebase from 'firebase/compat/app';

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
      map((posts: BlogPost[]) =>
        posts.map((post) => ({
          ...post,
          comments: post.comments ?? [],
        }))
      ),
      catchError((err) => {
        this.error = 'Error loading posts. Please try again later.';
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
        });
    }
  }

  getFormattedDate(
    timestamp:
      | firebase.firestore.Timestamp
      | Date
      | firebase.firestore.FieldValue
      | null
      | undefined
  ): Date | null {
    if (timestamp instanceof firebase.firestore.Timestamp) {
      return timestamp.toDate();
    } else if (timestamp instanceof Date) {
      return timestamp;
    }
    return null;
  }

  addNewPost(): void {}

  editPost(id: string): void {}
}
