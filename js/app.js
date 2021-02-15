'use strict'
var allData = [];
function Data(image_url, title, description, keyword, horns){
    this.image_url = image_url;
    this.title = title;
    this.description = description;
    this.keyword = keyword;
    this.horns = horns;
    allData.push(this);
}
Data.prototype.render = function(){
    var $data = $(".photo-template").clone();
    $("main").append($data);
    $data.find("h2").text(this.title)
    $data.find("img").attr("src", this.image_url)
    $data.find("img").attr("alt", this.keyword)
    $data.find("p").text(this.description)
    $data.removeClass("photo-template")
}
Data.prototype.readJSON = function(){
    $.getJSON("../data/page-1.json")
    .then(data =>{
        data.forEach(item =>{
            new Data(item.image_url, item.title,item.description, item.keyword, item.horns).render();
        })
    })
}
$(() =>{
    Data.prototype.readJSON();
 
    $("#selectKeyword").on("change", function(){
        $("section").show();
        var value = $(this).val();
        $("section").each(function(){
            if($(this).find("img").attr("alt") !== value){
                $(this).hide();
            }
        })
        if(value === "default"){
            $("section").show();
            $(".photo-template").hide();
        }
    })
    $("#sort").on("change", function(){
        var sort = $(this).val();
        if(sort === "title"){
            $("section").slice(1).sort((a,b) =>{

                if($(a).find("h2").text() > $(b).find("h2").text()){
                    return 1;
                } else if($(a).find("h2").text() < $(b).find("h2").text()){
                    return -1;
                } else{
                    return 0;
                }
            }).appendTo("main")
        } 
        else if(sort === "horns"){
            $("section").slice(1).sort((a,b) =>{
                var values = [$(a).find("p").text(),$(b).find("p").text()];
                values = values.map(letter =>allData.filter(d =>d.description === letter)[0].horns)
                if(values[0]>values[1]){
                    return 1;
                } else if(values[0]<values[1]){
                    return -1;
                } else{
                    return 0;
                }
            }).appendTo("main")
        }
        else{
            $("section").slice(1).remove()
            Data.prototype.readJSON();
        }
    })
})