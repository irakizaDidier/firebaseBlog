import { Component, EventEmitter, Input, Output } from '@angular/core';
import { v4 as uuidv4 } from 'uuid'; 

@Component({
  selector: 'app-add-post-modal',
  templateUrl: './add-post-modal.component.html',
  styleUrls: ['./add-post-modal.component.css'],
})
export class AddPostModalComponent {
  @Input() showModal = false;
  @Output() save = new EventEmitter<{
    id: string;
    title: string;
    content: string;
    authorId: string;
  }>();
  @Output() cancelAction = new EventEmitter<void>();

  title = '';
  content = '';

  generateCurrentUserId(): string {
    let currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) {
      currentUserId = uuidv4();
    }
    return currentUserId;
  }

  generatePostId(): string {
    return uuidv4();
  }

  onSubmit() {
    const authorId = this.generateCurrentUserId();
    const postId = this.generatePostId();

    if (this.title && this.content) {
      this.save.emit({
        id: postId,
        title: this.title,
        content: this.content,
        authorId,
      });
      this.title = '';
      this.content = '';
    }
  }

  cancel() {
    this.cancelAction.emit();
  }
}
