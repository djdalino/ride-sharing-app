export function getFormattedDate(date) {
    const d = new Date(date)
    
    let datePart = [
        d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()
      ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, '0')).join('/');
      let timePart = [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds()
      ].map((n, i) => n.toString().padStart(2, '0')).join(':');
      const combined = datePart + ' ' + timePart;
      return combined?.toString()
}