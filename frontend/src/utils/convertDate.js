/*
  Name: Daniel Urbina
  Date: 4/12/2024
  Course name and section: IT302-002
  Assignment Name: Phase 4
  Email: du35@njit.edu
*/
/*
    Source:
        Used this blog post to help me with the date conversion:
            https://rswpthemes.com/how-to-convert-seconds-to-years-months-days-hours-minutes-seconds/
*/
const convertDate = (date) => {
    const currentDate = new Date();
    const postDate = new Date(date);
    const differenceInSeconds = Math.floor((currentDate - postDate) / 1000);
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInMonth = 2592000;

    if(differenceInSeconds < secondsInMinute){
        return `${differenceInSeconds} second${differenceInSeconds === 1 ? '' : 's'} ago`
    }
    else if(differenceInSeconds < secondsInHour){
        const minutes = Math.floor(differenceInSeconds / secondsInMinute)
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    }
    else if(differenceInSeconds < secondsInDay){
        const hours = Math.floor(differenceInSeconds / secondsInHour)
        return `${hours} hour${hours === 1 ? '' : 's'} ago`
    } else {
        const months = Math.floor(differenceInSeconds / secondsInMonth);
        return `${months === 0 ? '1' : months} month${months === 1 ? '' : 's'} ago`
    }
}

export default convertDate;