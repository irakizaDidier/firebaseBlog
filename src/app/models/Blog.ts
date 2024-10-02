import firebase from 'firebase/compat/app';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: firebase.firestore.Timestamp;
  comments: Comment[];
}

interface Comment {
  userId: string;
  text: string;
  createdAt: firebase.firestore.Timestamp;
}
