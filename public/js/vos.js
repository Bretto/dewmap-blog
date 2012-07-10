function PostVO(date, year, title, text){
    this.date = !date ? moment(new Date()).format('MMM D'): date;
    this.year = !year ? moment().year() : year;
    this.title = title;
    this.text = text;
}