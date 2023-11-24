const isPendingAction = (action: { type: string }) => {
  return action.type.endsWith('pending');
};

const isFulfilledAction = (action: { type: string }) => {
  return action.type.endsWith('fulfilled');
};


export { isPendingAction, isFulfilledAction};