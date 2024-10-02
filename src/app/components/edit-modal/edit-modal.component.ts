import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BlogPost } from '../../models/Blog';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css'],
})
export class EditModalComponent {
  @Input() showModal = false;
  @Input() post: BlogPost | null = null;
  @Output() save = new EventEmitter<BlogPost>();
  @Output() cancel = new EventEmitter<void>();

  updatedPost: Partial<BlogPost> = {};

  ngOnChanges(): void {
    if (this.post) {
      this.updatedPost = { ...this.post };
    }
  }

  onSave(): void {
    if (this.updatedPost) {
      this.save.emit(this.updatedPost as BlogPost);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
