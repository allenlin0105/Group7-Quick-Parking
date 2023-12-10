export const calculateDurationInHours = (startTime, endTime) => {
    const startDate = new Date(startTime);
    let endDate;
    if (endTime) {
      endDate = new Date(endTime);
    }
    else {
      endDate = new Date();
    }
    const duration = ((endDate - startDate) / 1000 / 60 / 60).toFixed(1); // Convert milliseconds to hours
    return duration;
  };
