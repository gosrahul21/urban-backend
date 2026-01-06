export enum ProviderMatchStatus {
    PENDING = 'pending',     // request sent
    ACCEPTED = 'accepted',   // SP accepted
    REJECTED = 'rejected',   // SP rejected
    EXPIRED = 'expired',     // timeout
    CANCELLED = 'cancelled', // order cancelled
  }
  