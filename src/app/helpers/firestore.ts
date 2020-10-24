import { DocumentChange, DocumentChangeType, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { EntityAdapter, EntityState } from '@ngrx/entity';

export function includeId<T extends { id: string }>(snapshot: QueryDocumentSnapshot<T>): T {
  return {
    ...snapshot.data(),
    id: snapshot.id,
  };
}

export interface FirebaseChange<T extends { id: string }> {
  document: T;
  type: DocumentChangeType;
}

export function toFirebaseChange<T extends { id: string }>(payload: DocumentChange<T>): FirebaseChange<T> {
  return {
    document: includeId(payload.doc),
    type: payload.type,
  };
}

export function getUpdatedState<T extends { id: string }>(
  changes: FirebaseChange<T>[],
  state: EntityState<T>,
  adapter: EntityAdapter<T>,
): EntityState<T> {
  const upserts: T[] = [];
  const removes: string[] = [];

  for (const change of changes) {
    if (change.type === 'removed') {
      removes.push(change.document.id);
    } else {
      upserts.push(change.document);
    }
  }

  return adapter.removeMany(removes, adapter.upsertMany(upserts, state));
}
