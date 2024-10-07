import { Component, OnInit, signal } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/Blog';
import firebase from 'firebase/compat/app';
import { catchError, map } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  blogPosts = signal<BlogPost[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | undefined>(undefined);

  showDeleteModal = signal<boolean>(false);
  postToDeleteId = signal<string | null>(null);

  showEditModal = signal<boolean>(false);
  postToEdit = signal<BlogPost | null>(null);
  showAddPostModal = signal<boolean>(false);

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService
      .getPosts()
      .pipe(
        map((posts: BlogPost[]) =>
          posts.map((post) => ({
            ...post,
            comments: post.comments ?? [],
          }))
        ),
        catchError((err) => {
          this.error.set('Error loading posts. Please try again later.');
          this.loading.set(false);
          return [];
        })
      )
      .subscribe((posts) => {
        this.blogPosts.set(posts);
        this.loading.set(false);
      });
  }

  confirmDeletePost(id: string): void {
    this.postToDeleteId.set(id);
    this.showDeleteModal.set(true);
  }

  deletePost(): void {
    const id = this.postToDeleteId();
    if (id) {
      this.blogService
        .deletePost(id)
        .then(() => {
          this.showDeleteModal.set(false);
          this.blogPosts.set(this.blogPosts().filter((post) => post.id !== id));
        })
        .catch((err) => {
          this.error.set('Error deleting post. Please try again later.');
        });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
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

  editPost(id: string): void {
    const postToEdit = this.blogPosts().find((post) => post.id === id);
    if (postToEdit) {
      this.postToEdit.set(postToEdit);
      this.showEditModal.set(true);
    }
  }

  savePost(updatedPost: BlogPost): void {
    this.blogService
      .updatePost(updatedPost.id, updatedPost)
      .then(() => {
        this.showEditModal.set(false);
        const posts = this.blogPosts().map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        );
        this.blogPosts.set(posts);
      })
      .catch((err) => {
        this.error.set('Error updating post. Please try again later.');
      });
  }

  cancelEdit(): void {
    this.showEditModal.set(false);
  }

  openAddPostModal(): void {
    this.showAddPostModal.set(true);
  }

  cancelAddPost(): void {
    this.showAddPostModal.set(false);
  }

  createNewPost(postData: { title: string; content: string }): void {
    const postId = this.generatePostId(); 
    const currentUserId = this.generateCurrentUserId();

    const newPost: BlogPost = {
      id: postId,
      title: postData.title,
      content: postData.content,
      authorId: currentUserId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      comments: [],
    };

    this.blogService
      .createPost(newPost)
      .then(() => {
        this.showAddPostModal.set(false);
        this.blogPosts.set([...this.blogPosts(), newPost]);
      })
      .catch((err) => {
        this.error.set('Error creating new post. Please try again later.');
      });
  }

  generateCurrentUserId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `user-${timestamp}-${randomPart}`;
  }

  generatePostId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 9);
    return `post-${timestamp}-${randomPart}`;
  }
}
