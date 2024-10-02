import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BlogPost } from '../models/Blog';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private firestore: AngularFirestore) {}

  createPost(post: BlogPost) {
    return this.firestore.collection('posts').add(post);
  }

  getPosts(): Observable<BlogPost[]> {
    return this.firestore
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Omit<BlogPost, 'id'>;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
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
