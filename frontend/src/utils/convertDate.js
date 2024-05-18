const convertDate = (date) => {
    const currentDate = new Date();
    const postDate = new Date(date);
    const differenceInSeconds = Math.abs((postDate - currentDate) / 1000)
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInMonth = 2592000;

    if(differenceInSeconds < secondsInMinute){
        return `${Math.floor(differenceInSeconds)} second${differenceInSeconds === 1 ? '' : 's'} ago`
    }
    else if(differenceInSeconds < secondsInHour){
        const minutes = Math.floor(differenceInSeconds / secondsInMinute)
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    }
    else if(differenceInSeconds < secondsInDay){
        const hours = Math.floor(differenceInSeconds / secondsInHour)
        return `${hours} hour${hours === 1 ? '' : 's'} ago`
    } else if(differenceInSeconds < secondsInMonth){
        const days = Math.floor(differenceInSeconds / secondsInDay)
        return `${days} day${days === 1 ? '' : 's'} ago`
    } else {
        const months = Math.floor(differenceInSeconds / secondsInMonth);
        return `${months === 0 ? '1' : months} month${months === 1 ? '' : 's'} ago`
    }
}

export default convertDate;