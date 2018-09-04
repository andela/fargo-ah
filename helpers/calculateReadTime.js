const calculateReadTime = (wordCount) => {
  // Average read time is estimated as 265 words per minute
  const timeToRead = Math.ceil(wordCount / 265);
  return timeToRead;
};
export default calculateReadTime;
