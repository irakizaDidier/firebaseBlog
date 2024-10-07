import { Component, OnInit, signal } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { SeoService } from '../../services/seo.service'; // Import SeoService
import { BlogPost } from '../../models/Blog';
import firebase from 'firebase/compat/app';
import { catchError, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  blogPosts = signal<BlogPost[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | undefined>(undefined);
  currentUser = signal<firebase.User | null>(null);

  showDeleteModal = signal<boolean>(false);
  postToDeleteId = signal<string | null>(null);

  showEditModal = signal<boolean>(false);
  postToEdit = signal<BlogPost | null>(null);
  showAddPostModal = signal<boolean>(false);

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private seoService: SeoService, // Inject SeoService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser.set(user);
    });

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
        // Set the SEO meta tags after loading posts
        this.seoService.updateMetaTags(
          'Blog Posts',
          'Browse the latest blog posts'
        );
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

  editPost(id: string): void {
    const postToEdit = this.blogPosts().find((post) => post.id === id);
    if (postToEdit) {
      this.postToEdit.set(postToEdit);
      this.showEditModal.set(true);
      // Update SEO when editing a post
      this.seoService.updateMetaTags(
        `Edit ${postToEdit.title}`,
        `Editing the post titled ${postToEdit.title}`
      );
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
        // Update SEO after saving the post
        this.seoService.updateMetaTags(
          updatedPost.title,
          updatedPost.content.substring(0, 150)
        );
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
    // Set SEO when opening add post modal
    this.seoService.updateMetaTags('Create New Post', 'Write a new blog post');
  }

  cancelAddPost(): void {
    this.showAddPostModal.set(false);
  }

  createNewPost(postData: { title: string; content: string }): void {
    const postId = this.generatePostId();
    const currentUserId = this.currentUser()?.uid ?? 'anonymous';

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
        // Set SEO after creating a new post
        this.seoService.updateMetaTags(
          newPost.title,
          newPost.content.substring(0, 150)
        );
      })
      .catch((err) => {
        this.error.set('Error creating new post. Please try again later.');
      });
  }

  generatePostId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 9);
    return `post-${timestamp}-${randomPart}`;
  }

  generateCurrentUserId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `user-${timestamp}-${randomPart}`;
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle().catch((error) => {
      this.error.set('Error signing in with Google. Please try again.');
    });
  }

  signOut(): void {
    this.authService.signOut().catch((error) => {
      this.error.set('Error signing out. Please try again.');
    });
    this.router.navigate(['/login']);
  }
}
