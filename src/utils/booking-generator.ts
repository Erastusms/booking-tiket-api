export const generateBookingCode = () => {
  return 'BK-' + Date.now().toString(36).toUpperCase();
};
