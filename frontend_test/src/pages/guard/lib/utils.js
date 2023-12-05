export const calculateDurationInHours = (startTime, endTime) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const duration = ((endDate - startDate) / 1000 / 60 / 60).toFixed(1); // Convert milliseconds to hours
    return duration;
  };
