'use strict'
var allData = [];
const firstPageLink = "./data/page-1.json"
const secondPageLink = "../data/page-2.json"
function Data(item){
    for(let key in item){
        this[key] = item[key]
    }
    allData.push(this);
}
Data.prototype.render = function(){    
    var template = $("#photo-template").html()
    $("main").append(Mustache.render(template, this))
}
Data.prototype.readJSON = function(link){
    $.getJSON(link)
    .then(data =>{
        data.forEach(item =>{
            new Data(item).render();
        })
        $("#selectKeyword").triggerHandler("change");
        $("#sort").triggerHandler("change");
    })
}
$(() =>{
    displayImages(firstPageLink)
    $("#selectKeyword").on("change", function(){
        console.log("Hello")
        $("section").show();
        var value = $(this).val();
        $("section").each(function(){
            console.log(this)
            if($(this).find("img").attr("alt") !== value){
                $(this).hide();
            }
        })
        if(value === "default"){
            $("section").show();
            $(".photo-template").hide();
        }
    })
    $("#pageNumber").on("change", function(){
        if($(this).val() === "2"){
            $(".photo-template").siblings().remove();
            displayImages(secondPageLink)
        } else{
            $(".photo-template").siblings().remove();
            displayImages(firstPageLink) 
        }
    })
    $("#sort").on("change", function(){
        
        var sort = $(this).val();
        if(sort === "title"){
           $("section").sort((a,b) =>{
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
            $("section").sort((a,b) =>{
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
    })
})
function displayImages(page){
    Data.prototype.readJSON(page);  
}
