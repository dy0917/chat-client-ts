const isPendingAction = (sliceName:string)=>(action: { type: string }) => {
  return action.type.includes(sliceName)&&action.type.endsWith('pending');
};

const isFulfilledAction = (sliceName:string)=>(action: { type: string }) => {
  return action.type.includes(sliceName) &&action.type.endsWith('fulfilled');
};


export { isPendingAction, isFulfilledAction};