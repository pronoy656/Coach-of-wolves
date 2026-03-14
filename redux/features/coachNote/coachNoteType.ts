export interface CoachNote {
  _id: string;
  athleteId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CoachNoteResponse {
  success: boolean;
  message: string;
  data: CoachNote;
}

export interface CoachNotePayload {
  athleteId: string;
  note: string;
}

export interface CoachNoteState {
  notes: CoachNote[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
