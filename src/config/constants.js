const ROLES = {
  PROWNER: 'PROWNER',
  PRUNNER: 'PRUNNER',
};

const USER_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  BLOCKED: 'blocked',
};

const WALK_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
};

module.exports = {
  ROLES,
  USER_STATUS,
  WALK_STATUS,
  PAYMENT_STATUS,
};