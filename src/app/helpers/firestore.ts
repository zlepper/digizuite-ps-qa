import {DocumentChange, DocumentChangeType, QueryDocumentSnapshot} from '@angular/fire/firestore';

export function includeId<T extends { id: string }>(snapshot: QueryDocumentSnapshot<T>): T {
  return {
    ...snapshot.data(),
    id: snapshot.id,
  };
}

export interface FirebaseChange<T extends {id: string}> {
  document: T;
  type: DocumentChangeType;
}

export function toFirebaseChange<T extends {id: string}>(payload: DocumentChange<T>): FirebaseChange<T> {
  return {
    document: includeId(payload.doc),
    type: payload.type
  };
}
