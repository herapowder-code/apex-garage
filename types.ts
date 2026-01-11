
export interface ServiceHistoryItem {
  title: string;
  sub: string;
  date: string;
  miles: string;
  icon: string;
  verified: boolean;
}

export interface TrackingStep {
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  time?: string;
  icon: string;
}
