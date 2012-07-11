function PostVO(date, title, text){
    this.date = !date ? new Date().getTime(): date;
    this.title = title;
    this.text = text;
}