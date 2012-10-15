function PostVO(date, title, text){
    this.date = date ? date : new Date().getTime();
    this.title = title ? title : "Post Title";
    this.text = text ? text : "Post Content" ;
}