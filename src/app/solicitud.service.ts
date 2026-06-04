import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase.config';

@Injectable({ providedIn: 'root' })
export class SolicitudService {

  async crearSolicitud(data: any) {
    return await addDoc(collection(db, 'solicitudes'), {
      ...data,
      fechaCreacion: new Date(),
      estado: 'Pendiente'
    });
  }

  async getSolicitudesPorProgramador(programadorId: string) {
    const q = query(
      collection(db, 'solicitudes'),
      where('programadorId', '==', programadorId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async getSolicitudesPorUsuario(uid: string) {
    const q = query(
      collection(db, 'solicitudes'),
      where('uid', '==', uid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async actualizarSolicitud(id: string, data: any) {
    const ref = doc(db, 'solicitudes', id);
    return await updateDoc(ref, data);
  }
}
