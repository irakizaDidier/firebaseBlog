import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BlogPost } from '../models/Blog';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private firestore: AngularFirestore) {}

  createPost(post: BlogPost) {
    return this.firestore.collection('posts').add(post);
  }

  getPosts() {
    return this.firestore.collection('posts').snapshotChanges();
  }

  updatePost(postId: string, updatedPost: Partial<BlogPost>) {
    return this.firestore.doc(`posts/${postId}`).update(updatedPost);
  }

  deletePost(postId: string) {
    return this.firestore.doc(`posts/${postId}`).delete();
  }

  addComment(postId: string, comment: Comment) {
    return this.firestore.collection(`posts/${postId}/comments`).add(comment);
  }
}
