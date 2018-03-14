var request = {}
var channelready = false;
var channelgroup = [];
var daterange = [];
var weekrange = [];
var monthrange = [];
var quarterrange = [];
var yearrange =[];
var scrollLen = 0;
var scrollNum = 0;
var periodcheck = false;
var magicType = 'bar';
var activeChannel = 0;
var activePlatForm = 0;
var activeFlag = false;
var clickedCell = 0;
var sort = 'starttime';
var WPeriod = '';
var wto;
var page = 0;
var last_page = 0;
var scrollrequest = {};
var filterexist = false;
var box = '';
var listnum = 0;
var lilength = 0;
var TrendingProgTitleID = 0;
var TrendingChannelGroupID = 0;
var TrendingChannelID = 0;
var TrendingPeriodTypeID = 0;
var TrendingPeriod = 0;
var TrendingPlatFormID = 0;
var TrendingFilter = '';
var channelgroupid = 0;
var channelgroupid = 0;
var trendinglegend = [];
var filteractivechannel = 0;
var filteractiveplatform = 0;
var channelreq = [];
var programmereq = [];
var trendingreq = [];
var startloading = 0;
var channelplatforms = [];
var isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);
var base64 = '';
var exportchannelname = '';
var exportplatform = '';
var exportrendingplatform = []; 
var scg = "";
var sch = ""; 
var scp = "";
var datetoday = new Date();
var fytd = false;
var fytdString;
var navmodule = {
  /*
  ===== Initialize navigation
  */
  initnav : function(ChannelID,formID,PeriodType){
    if(channelready == false){
      /*
      ===== first step initialize Channel group and show when channel view = Separated
      ===== Ajax req for channel group
      */
      var promise = $.get(window.location.href + "channelgroup", request).then(function(data){
        console.log(data)
        $('#'+formID).find('option').remove();
        var selectBox = document.getElementById(formID);

        for(var i in data){
          channelgroup.push({ChannelGroupID : data[i].ChannelGroupID, ChannelGroupName : data[i].ChannelGroupName})
          selectBox.options.add(new Option(data[i].ChannelGroupName,  data[i].ChannelGroupID));
        }
        channelgroupid = $('#channelgroup').val()
        $('#'+formID).val(2000)
        /*
        ===== Ajax request for period range
        ===== initialize period range after the request
        */
        return $.get(window.location.href + "periodrange", request);
      }).then(function(data){
          var counter = 0
          for(var i in data){
            if(data[i].ProgDate != -1){
              switch(counter){
                case 0 :
                  /*
                  ===== default period and default scrollLength
                  */
                  daterange.push(data[i].ProgDate)
                  scrollLen = daterange.length - 1;
                  break;
                case 1 :
                  weekrange.push(data[i].ProgDate)
                  break;
                case 2 :
                  monthrange.push(data[i].ProgDate)
                  break;
                case 3 :
                  quarterrange.push(data[i].ProgDate)
                  break;
                case 4 :
                  yearrange.push(data[i].ProgDate)
                  break;
              }
            }else{
              counter++;
            }
          }

          daterange.sort(function(a, b){return b-a});
          weekrange.sort(function(a, b){return b-a});
          monthrange.sort(function(a, b){return b-a});
          quarterrange.sort(function(a, b){return b-a});
          yearrange.sort(function(a, b){return b-a});

          for(var i in daterange){
            daterange[i] = navmodule.convertProgdate(daterange[i],1)
          }
          for(var i in weekrange){
            weekrange[i] = navmodule.convertProgdate(weekrange[i],2)
          }
          for(var i in monthrange){
            monthrange[i] = navmodule.convertProgdate(monthrange[i],3)
          }
          for(var i in quarterrange){
            quarterrange[i] = navmodule.convertProgdate(quarterrange[i],4)
          }
          for(var i in yearrange){
            yearrange[i] = navmodule.convertProgdate(yearrange[i],5)
          }
          console.log(daterange)
          console.log(weekrange)
          $('#customperiod').val(daterange[0])

          var ChannelGroupID = $('#channelgroup').val()
          var PeriodTypeID = $('#periodtype').val();
          var Period = daterange[0]

          request = {
            ChannelGroupID : ChannelGroupID,
            PeriodTypeID : PeriodTypeID,
            Period : navmodule.externalProgdate(Period),
          }

          console.log(request)
          $.get(window.location.href + "platforms",{}, function(platforms){
            for(var i in platforms){
              channelplatforms.push({'PlatFormID':platforms[i].PlatFormID,'PlatFormName':platforms[i].PlatFormName})
            }
            console.log(platforms)
          });
          navmodule.scrollproperty()
          return $.get(window.location.href + "channelperformance", request);

      }).then(function(data){
        channelready = true;
        //navmodule.init_ChannelPerformance(data,$('#channelgroup').val())
      })
    }
  },
  /*
  ===== change performance
  */
  convertProgdate : function(progdate,ptype){
    progdate = progdate.toString();
    if(ptype == 1){
      var newdate = progdate.substring(6,8)+""+progdate.substring(4,6)+""+progdate.substring(2,4)
    }else if(ptype == 2){
      var newdate = progdate.substring(2,4)+""+progdate.substring(4,6)
    }else if(ptype == 3){
      var char = progdate.substring(4,6)
      if(char.charAt(0) == 0){
        var newdate = progdate.substring(2,4)+"m"+progdate.substring(5,6)
      }else{
        var newdate = progdate.substring(2,4)+"m"+progdate.substring(4,6)
      }
    }else if(ptype == 4){
      var newdate = progdate.substring(2,4)+"q"+progdate.substring(5,6)
    }else if(ptype == 5){
      var newdate = progdate.substring(2,4)
    }

    //console.log(newdate)
    return newdate
  },
  externalProgdate : function(progdate){
    progdate = progdate.toString();
    if($('#periodtype').val() == 1){
      var newdate = "20"+progdate.substring(4,6)+""+progdate.substring(2,4)+""+progdate.substring(0,2)
    }else if($('#periodtype').val() == 2){
      var newdate = "20"+progdate.substring(0,2)+""+progdate.substring(2,4)
    }else if($('#periodtype').val() == 3){
      if(progdate.length == 4){
        var newdate = "20"+progdate.substring(0,2)+"0"+progdate.substring(3,4)
      }else{
        var newdate = "20"+progdate.substring(0,2)+""+progdate.substring(3,5)
      }
    }else if($('#periodtype').val() == 4){
      var newdate = "20"+progdate.substring(0,2)+"0"+progdate.substring(3,4)
    }else if($('#periodtype').val() == 5){
      var newdate = "20"+progdate.substring(0,2)
    }
    //console.log(newdate)
    return newdate
  },
  exportchannel : function(req){    
    console.log(req)    
    $.get(window.location.href + "exportchannel", req, function(data){
      console.log(data)
      var expotRows = [];
      var dt = new Date();
      var datetime = dt.getFullYear() + "" + Number(dt.getMonth() + 1)  + "" + dt.getDate() + "" + dt.getHours() + "" + dt.getMinutes() + "" + dt.getSeconds();
      var filterval = $('#filterbmi').val() != '' ? $('#filterbmi').val() : 'None';
      expotRows.push(["Channel list, "+ $('#channelgroup option:selected').text(),"Period, "+ $('#periodtype option:selected').text()+ ": " + $('#customperiod').val(),"Search, "+ filterval,""]);
      expotRows.push(["Channel Name","Platform Name","000"]);
      var totalchannels = []
      for (var i in data) {
          var sum000val = Number(data[i].Sum000).toFixed(2).replace(/\./g, ',');
          if(data[i].ChannelID != -1){
            if($('#channelgroup').val() != 2000){
              
              if(data[i].ChannelName != ""){
                expotRows.push([data[i].ChannelName,data[i].PlatFormName,sum000val]);
              }else{
                expotRows.push(["Total",data[i].PlatFormName,sum000val]);
              }
              if($.inArray(data[i].ChannelName, totalchannels) == -1){
                totalchannels.push(data[i].ChannelName)
              }  
            
            }else{              
              if(data[i].ChannelGroupName != ""){
                expotRows.push([data[i].ChannelGroupName,data[i].PlatFormName,sum000val]);
              }else{
                expotRows.push(["Total",data[i].PlatFormName,sum000val]);
              }              

              if($.inArray(data[i].ChannelGroupName, totalchannels) == -1){
                totalchannels.push(data[i].ChannelGroupName)
              }   
            }
          }else{
            expotRows.push(["Total",data[i].PlatFormName,sum000val]);
          }                  
      }
      for(var i in totalchannels){
        var totalfigure = 0;
        for(var d in data){         
          if(data[d].ChannelID != -1){
            if(totalchannels[i] == data[d].ChannelName){
              totalfigure += parseFloat(data[d].Sum000)
              console.log(data[d].Sum000)
            }
          }

          if(data[d].ChannelGroupID != -1){
            if(totalchannels[i] == data[d].ChannelGroupName){
              totalfigure += parseFloat(data[d].Sum000)
              console.log(data[d].Sum000)
            }
          }
          //console.log(totalfigure)
        }
        if(totalchannels[i] != ""){
          expotRows.push([totalchannels[i],"Total",totalfigure.toFixed(2).replace(/\./g, ',')]);
        }         
      }
      var totaltotalfigure = 0;
      for(var d in data){         
        if(data[d].ChannelID == -1){
          totaltotalfigure += parseFloat(data[d].Sum000)
        }

        if(data[d].ChannelGroupID == -1){
          totaltotalfigure += parseFloat(data[d].Sum000)           
        }
      }
      expotRows.push(["Total","Total",totaltotalfigure.toFixed(2).replace(/\./g, ',')]);
      alasql("SELECT * INTO "+ $("input[name='format']:checked").val() +" ('ChannelPerformance"+ datetime +"."+ $("input[name='format']:checked").val() +"',{headers:false}) FROM ? ", [expotRows]);
      $('#dlchannel').html("Toogle button to download again.")
    });
  },
  exportprogramme : function(req){    
    $.get(window.location.href + "exportprogramme", req, function(data){
      console.log(data)      
      var expotRows = [];
      var dt = new Date();
      var datetime = dt.getFullYear() + "" + Number(dt.getMonth() + 1)  + "" + dt.getDate() + "" + dt.getHours() + "" + dt.getMinutes() + "" + dt.getSeconds();
      var filterval = $('#filterbmi').val() != '' ? $('#filterbmi').val() : 'None';
      expotRows.push(["Channel list, "+ $('#channelgroup option:selected').text(),"Period, "+ $('#periodtype option:selected').text() + ": " + $('#customperiod').val(),"Search, "+ filterval,"",""]);           
      expotRows.push(["Channel name: "+ exportchannelname,"Platform name: " + exportplatform,"",""]);

      if($('#periodtype').val() == 1 && $('#channelgroup').val() != 2000 && activeChannel != -1 && activePlatForm == 1){
        expotRows.push(["BMICode","ProgrammeTitle","Start time","# Linear runs","000"]);    
      }else{
        expotRows.push(["BMICode","ProgrammeTitle","# Linear runs","000"]);
      }                
      
      for (var i in data) {
        var sum000val = Number(data[i].Sum000).toFixed(2).replace(/\./g, ',');
        if($('#periodtype').val() == 1 && $('#channelgroup').val() != 2000 && activeChannel != -1 && activePlatForm == 1){
          expotRows.push([data[i].BMICode,data[i].ProgrammeTitle,data[i].FirstFromTime,data[i].CNT,sum000val]);
        }else{
          expotRows.push([data[i].BMICode,data[i].ProgrammeTitle,data[i].CNT,sum000val]);
        }        
      }
      
      alasql("SELECT * INTO "+ $("input[name='format']:checked").val() +" ('ProgrammePerformance"+ datetime +"."+ $("input[name='format']:checked").val() +"',{headers:false}) FROM ? ", [expotRows]);      
      $('#dlprog').html("Toogle button to download again.")  
    })
  },
  exporttrending : function(req){    
    console.log(req)    
    var filterval = $('#filterbmi').val() != '' ? $('#filterbmi').val() : 'None';
    $.ajax({
      type: "POST",
      url: "/spreadsheet/basic.php?"+ req +"&Channel="+exportchannelname+"&Platform="+exportplatform,
      data: {
        img: base64.src,
        Channellist : $('#channelgroup option:selected').text(),
        PeriodType : $('#periodtype option:selected').text(),
        Periodnum : $('#customperiod').val(),
        filterval : filterval,
        formname : exportrendingplatform,
      },
      contentType: "application/x-www-form-urlencoded;charset=UTF-8",
      success: function(result){
        console.log(result)
        if(result == 'done'){
          window.open('/spreadsheet/trending.xlsx','_blank');
          /*$('#dltrend').attr('href','/spreadsheet/trending.xlsx')
          $('#dltrend').html("Click here to download")
          $('#dltrend').attr('disable',false)*/
          $('#dltrend').html("Toogle button to download again.")  
        }
      }
    })    
  },
  ChannelPerformanceRequest : function(){
    var ChannelGroupID = $('#channelgroup').val()
    var PeriodTypeID = $('#periodtype').val();
    if(fytd == false){
      if(WPeriod != ''){
        var Period = WPeriod
      }else{
        var Period = navmodule.externalProgdate($('#customperiod').val())
      }
    }else{
      var Period = fytdString;
    }
    

    if(filterexist == true){
      var filter = $('#filterbmi').val()
    }else{
      var filter = ''
    }
    request = {
      ChannelGroupID : ChannelGroupID,
      PeriodTypeID : PeriodTypeID,
      Period : Period,
      ChannelGroupID : ChannelGroupID,
      Filter : filter
    }
    console.log(request)
    channelreq = 'ChannelGroupID' + "=" + 
                  ChannelGroupID + "&" + 'PeriodTypeID' + "=" + 
                  PeriodTypeID + "&" + 'Period' + "=" + Period + "&" + 'ChannelGroupID' + "=" + ChannelGroupID + "&" + 'Filter' + "=" + filter;
    //loadingstate()
    $.get(window.location.href + "channelperformance", request, function(data){
      navmodule.init_ChannelPerformance(data,ChannelGroupID)
    });
  },
  /*
  ===== initialize performance
  */
  init_ChannelPerformance : function(data,ChannelGroupID){
    if(data.length > 0){
      console.log(data)
      var ChannelID = [];
      var PlatformName = [];
      for(var i in data){
        var TempChannelID = ChannelGroupID != 2000 ? data[i].ChannelID : data[i].ChannelGroupID;
        ChannelID.push(TempChannelID)
        //PlatformName1.push({id : data[i].PlatFormID, PlatFormName : data[i].PlatFormName})
        PlatformName.push(data[i].PlatFormName)
        var legendvalue = false;                     
      }
      console.log(trendinglegend)
      ChannelID = _.uniq(ChannelID);
      //var Formname = _.uniq(PlatformName);
      var Formname = [];
      exportrendingplatform = [];
      //channelplatforms.push({'PlatFormID':platforms[i].PlatFormID,'PlatFormName':platforms[i].PlatFormName,})
      for(var i in channelplatforms){
        Formname.push(channelplatforms[i].PlatFormName)
        exportrendingplatform.push({'id': channelplatforms[i].PlatFormID, 'name': channelplatforms[i].PlatFormName})
        trendinglegend.push({PlatFormID:channelplatforms[i].PlatFormID,PlatFormName : channelplatforms[i].PlatFormName})
      }
      console.log(Formname)
      var PerformanceChannels = []
      var totalLinear = [];
      var PlatFormIDs = []
      for(var i in ChannelID){
        var Channels = [];
        var ChannelName = "";
        for(var x in data){
          if(ChannelGroupID != 2000){
            var TempChannelID = data[x].ChannelID;
          }else{
            var TempChannelID = data[x].ChannelGroupID;
          }

          if(TempChannelID == ChannelID[i]){
            if(ChannelGroupID != 2000){
                ChannelName = ChannelName == "" ? data[x].ChannelName : data[x].ChannelName ;
            }else{
                ChannelName = ChannelName == "" ? data[x].ChannelGroupName : data[x].ChannelGroupName ;
            }
            PlatFormIDs.push(data[x].PlatFormID)
            if(data[x].PlatFormID == 1){
              if($('#unit').val() == 1){
                var avg = Number(data[x].Sum000).toFixed(2)
              }else{
                var avg = Number(data[x].SumATV).toFixed(2)
              }
              totalLinear = Number(totalLinear) + Number(avg)
            }

            Channels.push({
              PlatFormID : data[x].PlatFormID,
              PlatFormName : data[x].PlatFormName,
              Sum000 : data[x].Sum000,
              SumATV : data[x].SumATV,
            })
          }
        }

        PerformanceChannels.push({
          ChannelID : ChannelID[i],
          ChannelName : ChannelName,
          Channels : Channels,
        })

      }
      console.log(PerformanceChannels)      
      var totalCell = false;
      var tdwidth = 100 / (Formname.length + 2)
      var delivered = false;
      var GetChannelIDs = [];
      var GetPlatFormIDs = [];
      for(var i in PerformanceChannels){
        GetChannelIDs.push(PerformanceChannels[i].ChannelID)
        for(var x in PerformanceChannels[i].Channels){
          GetPlatFormIDs.push(PerformanceChannels[i].Channels[x].PlatFormID)
        }
      }

      var output = '<table class="table-bordered table-channelperformance" id="table-channelperformance" width="100%">';
        output += '<thead class="bg-white"><tr><td width="250"></td>';
      for(var i in Formname){
        output += '<td class="text-center"><img height="50" src="channel/'+ Formname[i] +'.png" alt="'+ Formname[i] +'"></td>';
      }
        output += '<td class="text-center bg-light" width="150"><img width="25" src="channel/globe.png" class="img-responsive">&nbsp;&nbsp;<small>TOTAL</small></td>';
        output += '</tr></thead><tbody>';
        var globaltotal = 0;
      for(var i in PerformanceChannels){
        if(PerformanceChannels[i].ChannelName.indexOf('TNT Comedy HD') == -1){
          var logo = PerformanceChannels[i].ChannelName.replace('.', '-');
        }else{
          var logo = 'TNT Comedy';
        }

        if($('#channelgroup').val() == 1){
          var size = 30
        }else{
          var size = 40
        }
        var totalAvgVal = 0;
        output += '<tr>';
        if(PerformanceChannels[i].ChannelName != ''){
          output += '<td>'+ PerformanceChannels[i].ChannelName +'<img width="30" class="float-right pixelated" src="logo/'+ logo.replace('+', '-') +'.png" class="img-responsive"></td>';
        }else{
          output += '<td class="text-center bg-light"><img width="25" src="channel/globe.png" class="img-responsive">&nbsp;&nbsp;TOTAL</td>';
        }
        for(var x in Formname){

          var flag = false; for(var p in PerformanceChannels[i].Channels){
          if(PerformanceChannels[i].Channels[p].PlatFormName == Formname[x]){
          var PFormID = PerformanceChannels[i].Channels[p].PlatFormID;

              flag = true;
              console.log(delivered + "=" + activeChannel + "&" + activePlatForm + "=" + $.inArray( activeChannel , GetChannelIDs ) + "&" + $.inArray( activePlatForm , GetPlatFormIDs ))
              if(delivered == false && $.inArray( activeChannel , GetChannelIDs ) == -1 && $.inArray( activePlatForm , GetPlatFormIDs ) == -1){
                if(ChannelGroupID != 2000){
                  var ChGroupID = -1;
                  var ChID = PerformanceChannels[i].ChannelID
                  activeChannel = ChID
                }else{
                  var ChGroupID = PerformanceChannels[i].ChannelID
                  var ChID = -1;
                  activeChannel = ChGroupID
                }
                activePlatForm = PFormID;
                var PFormID = PFormID
                var PtypeID = $('#periodtype').val()
                if(fytd == false){
                  if(WPeriod != ''){
                    var Prange = WPeriod
                  }else{
                    var Prange = navmodule.externalProgdate($('#customperiod').val())
                  }
                }else{
                  var Prange = fytdString;
                }                

                if($('#periodtype').val() == 1 && ChGroupID == -1 && ChID != -1 && PFormID == 1){
                  sort = 1
                }else{
                  sort = 3
                }            
                exportchannelname = PerformanceChannels[i].ChannelName;
                exportplatform = Formname[x];                               
                navmodule.init_ProgrammePerformance(ChGroupID,ChID,PFormID,PtypeID,Prange,PerformanceChannels[i].ChannelName,Formname[x],sort)
                navmodule.init_trending(-1,ChGroupID,ChID,PtypeID,Prange,PFormID,PerformanceChannels[i].ChannelName, Formname[x])
                delivered = true;
                var activecell = 'active'
              }else if(activeChannel == PerformanceChannels[i].ChannelID && activePlatForm == PFormID){
                if(ChannelGroupID != 2000){
                  var ChGroupID = -1;
                  var ChID = PerformanceChannels[i].ChannelID
                  activeChannel = ChID
                }else{
                  var ChGroupID = PerformanceChannels[i].ChannelID
                  var ChID = -1;
                  activeChannel = ChGroupID
                }
                activePlatForm = PFormID;
                var PFormID = PFormID
                var PtypeID = $('#periodtype').val()
                if(fytd == false){
                  if(WPeriod != ''){
                    var Prange = WPeriod
                  }else{
                    var Prange = navmodule.externalProgdate($('#customperiod').val())
                  }
                }else{
                  var Prange = fytdString;
                } 
                
                if(PerformanceChannels[i].ChannelID == -1){
                  ChGroupID = $('#channelgroup').val();
                  ChID = -1;
                  var progchannelicon = Formname[x];
                  var formnameicon = 'Total';
                  exportchannelname = 'Global';
                  exportplatform = Formname[x];
                }else{
                  var progchannelicon = PerformanceChannels[i].ChannelName;
                  var formnameicon = Formname[x];
                }


                if($('#periodtype').val() == 1 && ChGroupID == -1 && ChID != -1 && PFormID == 1){
                  sort = 1;
                }else{
                  sort = 3;
                }                            
                navmodule.init_ProgrammePerformance(ChGroupID,ChID,PFormID,PtypeID,Prange,progchannelicon,formnameicon,sort)
                navmodule.init_trending(-1,ChGroupID,ChID,PtypeID,Prange,PFormID,progchannelicon + " - " +formnameicon)
                delivered = true;
                var activecell = 'active rounded'
              }else{
                var activecell = ''
              }

              if($('#unit').val() == 1){
                var avgval = Number(PerformanceChannels[i].Channels[p].Sum000).toFixed(2)
              }else{
                var avgval = Number(PerformanceChannels[i].Channels[p].SumATV).toFixed(2)
              }
              totalAvgVal = Number(totalAvgVal) + Number(avgval)

              if(PerformanceChannels[i].ChannelID != -1){
                output += '<td class="'+ activecell +'" id="'+PerformanceChannels[i].ChannelID+'" value="'+ PFormID +'" data-id="'+PerformanceChannels[i].ChannelName+'" data-value="'+ Formname[x] +'">'+ avgval + '</td>';
              }else{
                globaltotal = Number(globaltotal) + Number(avgval);
                output += '<td class="'+ activecell +' bg-light" id="'+PerformanceChannels[i].ChannelID+'" value="'+ PFormID +'" data-id="'+Formname[x]+'" data-value="TOTAL">'+ avgval +'</td>'
              }

              break;
            }
          }

          if(flag == false){
            output += '<td> - </td>';
          }

        }

        if(activePlatForm == -1 && activeChannel == PerformanceChannels[i].ChannelID){          
          if(ChannelGroupID != 2000){
            var ChGroupID = -1;
            var ChID = PerformanceChannels[i].ChannelID
            activeChannel = ChID
          }else{
            var ChGroupID = PerformanceChannels[i].ChannelID
            var ChID = -1;
            activeChannel = ChGroupID
          }
          activePlatForm = -1;
          var PFormID = -1
          var PtypeID = $('#periodtype').val()
          if(fytd == false){
            if(WPeriod != ''){
              var Prange = WPeriod
            }else{
              var Prange = navmodule.externalProgdate($('#customperiod').val())
            }
          }else{
            var Prange = fytdString;
          } 
          
          
          if($('#periodtype').val() == 1 && ChGroupID == -1 && ChID != -1 && PFormID == 1){
            sort = 1
          }else{
            sort = 3
          }
                             
          if(ChGroupID == -1 && ChID == -1){  
            var channeliconname = 'Global';
            var formaname = 'Total';             
            var cg =  $('#channelgroup').val();
            var ch = -1;                
          }else{
            var channeliconname = PerformanceChannels[i].ChannelName;
            var formaname = 'Total';  
            var cg =  ChGroupID
            var ch = ChID            
          }            
          navmodule.init_ProgrammePerformance(cg,ch,-1,PtypeID,Prange,channeliconname,formaname,sort)
          navmodule.init_trending(-1,cg,ch,PtypeID,Prange,-1,channeliconname + " - " +formaname)
          delivered = true;
          var activeTotalCell = 'active rounded'
        }else{
          var activeTotalCell = ''
        }
        
        if(PerformanceChannels[i].ChannelName != ''){
          output += '<td class="'+ activeTotalCell +' bg-light" id="'+PerformanceChannels[i].ChannelID+'" value="-1" data-id="'+PerformanceChannels[i].ChannelName+'" data-value="Total">'+ Number(totalAvgVal).toFixed(2) +'</td>';
        }else{
          output += '<td class="'+ activeTotalCell +' bg-light" id="-1" value="-1" data-id="Global" data-value="Total">'+ Number(globaltotal).toFixed(2) +'</td>'
        }
        output += '</tr>';
      }  

      output += '</tr>'
      output += '</tbody></table>';
      $('#channelperformance').scrollTop(0)
      $('#channelperformance').html(output)      
      var $table = $('table#table-channelperformance');
      $table.floatThead();      
      var channeltable = ($('#channelperformance').width() - 280) / Formname.length
      $('#channelperformance td:not(:first-child)').css({
        width : channeltable+'px',
      })      
      $('.floatThead-col').css({
        height : "53px",
      })
      $('#table-channelperformance td:not(:first-child)').each(function(){
        $(this).click(function(){
          if($(this).attr("id")!= undefined){

            $('#table-channelperformance td:not(:first-child)').each(function(){
              $(this).removeClass('active')
            })
            $(this).addClass('active')

            if(($(this).attr("id") == -1 && $(this).attr("value") != -1) || ($(this).attr("id") == -1 && $(this).attr("value") == -1)){
              var ChGroupID = ChannelGroupID;
              var ChID = -1              
            }else{
              if(ChannelGroupID != 2000){
                var ChGroupID = -1;
                var ChID = $(this).attr("id");
              }else{
                var ChGroupID = $(this).attr("id");
                var ChID = -1;
              }
            }            

            var ProgTitleID = -1;
            var PFormID = $(this).attr("value")
            var PtypeID = $('#periodtype').val()
            if(fytd == false){
              if(WPeriod != ''){
                var Prange = WPeriod
              }else{
                var Prange = navmodule.externalProgdate($('#customperiod').val())
              }
            }else{
              var Prange = fytdString;
            } 

            activeChannel = $(this).attr("id");
            activePlatForm = $(this).attr("value")
            filteractivechannel = activeChannel;
            filteractiveplatform = activePlatForm;
            if($('#periodtype').val() == 1 && ChGroupID == -1 && ChID != -1 && PFormID == 1){
              sort = 1
            }else{
              sort = 3
            }
            exportchannelname = $(this).data('id');
            exportplatform = $(this).data('value');             
            navmodule.init_ProgrammePerformance(ChGroupID,ChID,PFormID,PtypeID,Prange,$(this).data('id'),$(this).data('value'),sort)
            navmodule.init_trending(ProgTitleID,ChGroupID,ChID,PtypeID,Prange,PFormID,$(this).data('id') + ' - ' + $(this).data('value'))

          }
        })
      })
    }else{
      $('#channelperformance').html('')
      $('#programeperformance').html('')
      $('#bargraph').html('')
    }
  },
  /*
  ===== programme performance
  */
  init_ProgrammePerformance : function(ChGroupID,ChID,PFormID,PtypeID,Prange,ChannelName,FormName,SumSort){
    if(filterexist == true){
      var filter = $('#filterbmi').val()
    }else{
      var filter = ''
    }  
    page = 1;
    request = {
      ChannelGroupID : ChGroupID,
      ChannelID : ChID,
      PlatFormID : PFormID,
      PeriodTypeID : PtypeID,
      Period : Prange,
      Filter : filter,
      InputSortID : SumSort,
      page : page,
    }
    
    if(SumSort == 1){
      var starttime = '<img height="20" src="sort/sort.png" class="img-responsive float-right">'
      var sort000 = '';
      var sortCount = ''
      var sortATV = ''
    }else if(SumSort == 3){
      var starttime = '';
      var sort000 = '<img height="20" src="sort/sort.png" class="img-responsive float-right">'
      var sortCount = ''
      var sortATV = ''
    }else if(SumSort == 2){
      var starttime = '';
      var sort000 = ''
      var sortCount = '<img height="20" src="sort/sort.png" class="img-responsive float-right">'
      var sortATV = ''
    }

    console.log(request)
    
    programmereq = 'ChannelGroupID' +"="+ ChGroupID + "&" +
      'ChannelID' +"="+ ChID + "&" +
      'PlatFormID' +"="+ PFormID + "&" +
      'PeriodTypeID' +"="+ PtypeID + "&" +
      'Period' +"="+ Prange + "&" +
      'Filter' +"="+ filter + 
      'InputSortID' +"="+ SumSort;

    $.get(window.location.href + "programmeperformance", request, function(data){
      console.log(data)
      var form ='<img height="30" src="channel/'+ FormName +'.png" alt="'+ FormName +'">'      
      var output = '<table class="table table-bordered" id="table-programmeperformance" width="100%">';
      if(ChannelName.indexOf('TNT Comedy HD') == -1){
        var cname = ChannelName.replace('.', '-');
      }else{
        var cname = 'TNT Comedy';
      }
      if($('#periodtype').val() == 1 && ChGroupID == -1 && ChID != -1 && PFormID == 1){
        var colspan = 5
        var headstarttime = '<td id="sort" value="1" value><small>Start time'+ starttime +'</small></td>';                        
      }else{
        var colspan = 4
        var headstarttime = '';
      }   
      output += '<thead class="bg-white">'+
      '<tr>'+
        '<td colspan="'+ colspan +'">'+ form +'&nbsp;&nbsp;&nbsp;&nbsp;<img height="30" src="logo/'+ cname.replace('+', '-') +'.png"></td>'+
      '</tr>'+
      '<tr>'+
        '<td width="200"><small>Programme Title</small></td>'+
        headstarttime +
        '<td><small>Sky 360 BMI</small></td>'+
        '<td id="sort" value="2"><small># linear runs</small>'+ sortCount +'</td>' + 
        '<td id="sort" value="3"><small>000</small>'+ sort000 +'</td>'+          
      '</tr></thead><tbody>';
      
      var ShowFromTime =$('#periodtype').val() == 1 && ChGroupID == -1 && ChID != -1 && PFormID == 1; 
      scg = ChGroupID;
      sch = ChID;
      scp =PFormID;     
      for(var i in data.data.data){
        if(ShowFromTime){
          var FirstFromTime = '<td>'+ data.data.data[i].FirstFromTime  +'</td>';
        }else{
          var FirstFromTime = '';
        }
        output += '<tr id="'+ data.data.data[i].BMICode +'" value="'+ data.data.data[i].ProgrammeTitle +'">'+
          '<td><span>'+ data.data.data[i].ProgrammeTitle+'</span></td>'+
          FirstFromTime +
          '<td>'+ data.data.data[i].BMICode +'</td>'+
          '<td>'+ data.data.data[i].CNT +'</td>' + 
          '<td>'+ Number(data.data.data[i].Sum000).toFixed(2) +'</td>'+              
        '</tr>';                      
      }      
      output += '</tbody></table>'
      $('#programeperformance').scrollTop(0)
      $('#programeperformance').html(output)
      last_page = data.data.last_page;
      console.log(last_page)
      page++;
      scrollrequest = {
        ChannelGroupID : ChGroupID,
        ChannelID : ChID,
        PlatFormID : PFormID,
        PeriodTypeID : PtypeID,
        Period : Prange,
        Filter : filter,
        InputSortID : SumSort,
        page : page,
      }                             

      $('#table-programmeperformance #sort').each(function(){
        $(this).click(function(){
          navmodule.init_ProgrammePerformance(ChGroupID,ChID,PFormID,PtypeID,Prange,ChannelName,FormName,$(this).attr('value'))          
        })
      })
      $('#table-programmeperformance tr').each(function(){
        var ChannelGroupID = $('#channelgroup').val();
        $(this).click(function(){
          if($(this).attr("id")!= undefined){
            $('#table-programmeperformance tr').each(function(){
              $(this).removeClass('active')
            })
            $(this).addClass('active')
            var BMIFilter = $(this).attr('id')
            $('#filterbmi').val(BMIFilter)
            filterexist = true;
            navmodule.ChannelPerformanceRequest()
          }
        })
      })
      var $table = $('table#table-programmeperformance');
      $table.floatThead({
        responsiveContainer: function($table){
            return $table.closest('.table-responsive');
        }
      });
    })
  },
  init_trending : function(ProgTitleID,ChGroupID,ChID,PtypeID,Prange,PFormID,TrendingTitle){

    if($('#periodtype').val() != 4 && $('#periodtype').val() != 5){
      if(filterexist == true){
        var filter = $('#filterbmi').val()
      }else{
        var filter = ''
      }

      TrendingProgTitleID = ProgTitleID;
      TrendingChannelGroupID = ChGroupID;
      TrendingChannelID = ChID;
      TrendingPeriodTypeID = PtypeID;
      TrendingPeriod = Prange;
      TrendingPlatFormID = PFormID;
      TrendingFilter = filter;

      request = {
        ProgTitleID : ProgTitleID,
        ChannelGroupID : ChGroupID,
        ChannelID : ChID,
        PeriodTypeID : PtypeID,
        Period : Prange,
        PlatFormID : PFormID,
        Filter : filter,
      }
      trendingreq = 'ProgTitleID' +"="+ ProgTitleID+"&"+
        'ChannelGroupID' +"="+ ChGroupID+"&"+
        'ChannelID' +"="+ ChID+"&"+
        'PeriodTypeID' +"="+ PtypeID+"&"+
        'Period' +"="+ Prange+"&"+
        'PlatFormID' +"="+ PFormID+"&"+
        'Filter' +"="+ filter;
      if($('#barnum').val() != '' && $.isNumeric($('#barnum').val()) == true && $('#barnum').val() <= 13){
        var barnum = Number($('#barnum').val())
      }else{
        var barnum = 13;
      }
      console.log(request)
      $.get(window.location.href + "trending", request, function(data){
        console.log(data)

        var chartval = []
        var label = []
        var dataseries = []
        var PlatFormIDnum = [];
        var num = $('#periodtype').val()
        for(var i in data){
          PlatFormIDnum.push(data[i].PlatFormID)
        }
        switch(num){
          case '1' :
              for(var i=scrollNum; i< Number(barnum + scrollNum); i++){
                if(Number(i) < daterange.length){
                  label.push(navmodule.externalProgdate(daterange[i],1))
                }
              }
            break;
          case '2' :
              for(var i=scrollNum; i< Number(barnum + scrollNum); i++){
                if(Number(i) < weekrange.length){
                  label.push(navmodule.externalProgdate(weekrange[i],2))
                }
              }
            break;
          case '3' :
              for(var i=scrollNum; i< Number(barnum + scrollNum); i++){
                if(Number(i) < monthrange.length){
                  label.push(navmodule.externalProgdate(monthrange[i],3))
                }
              }
            break;
          case '4' :
              for(var i=scrollNum; i< Number(barnum + scrollNum); i++){
                if(Number(i) < quarterrange.length){
                  label.push(navmodule.externalProgdate(quarterrange[i],4))
                }
              }

              for(var i=scrollNum; i< Number(barnum + scrollNum); i++){
                label.push(navmodule.externalProgdate(quarterrange[i],4))
              }
            break;
          case '5' :

            break;
        }

        label.sort(function(a, b){return a-b});
        console.log(label)
        var uniqLabel = label
        var axislabel = []
        for(var i in label){
          axislabel.push(uniqLabel[i])
        }

        var PFormIDs = _.uniq(PlatFormIDnum)
        PlatFormIDnum.sort(function(a, b){return a-b});
        var graphlegend = [];
        for(var i in PFormIDs){
          for(var x in trendinglegend){
            if(trendinglegend[x].PlatFormID == PFormIDs[i]){
              graphlegend.push(trendinglegend[x].PlatFormName)
              break;
            }
          }
        }
        console.log(graphlegend)

        if(PFormIDs.length == 1){
          console.log('test')
          var average = [];
          for(var x in axislabel){
            var lableexist = false;
            switch(num){
              case '1' :
                for(var i in data){
                  if(axislabel[x] == data[i].ProgDate){
                    if(Number(x) < barnum){
                      if($('#unit').val() == 1){
                        average.push(Number(data[i].Sum000).toFixed(2))
                      }else{
                        average.push(Number(data[i].SumATV).toFixed(2))
                      }
                      lableexist = true;
                      break;
                    }
                  }
                  var barcolor = data[i].ColorCode;
                }
                if(lableexist == false){
                  average.push(Number(0).toFixed(2));
                }
                break;
              case '2' :

                for(var i in data){
                  if(axislabel[x] == data[i].WeekNumber){
                    if(Number(x) < barnum){
                      if($('#unit').val() == 1){
                        average.push(Number(data[i].Sum000).toFixed(2))
                      }else{
                        average.push(Number(data[i].SumATV).toFixed(2))
                      }
                      lableexist = true;
                      break;
                    }
                  }
                  var barcolor = data[i].ColorCode;
                }
                if(lableexist == false){
                  average.push(Number(0).toFixed(2));
                }

                break;
              case '3' :

                for(var i in data){
                  if(axislabel[x] == data[i].MonthNumber){
                    if(Number(x) < barnum){
                      if($('#unit').val() == 1){
                        average.push(Number(data[i].Sum000).toFixed(2))
                      }else{
                        average.push(Number(data[i].SumATV).toFixed(2))
                      }
                      lableexist = true;
                      break;
                    }
                  }
                  var barcolor = data[i].ColorCode;
                }
                if(lableexist == false){
                  average.push(Number(0).toFixed(2));
                }

                break;
              case '4' :

                for(var i in data){
                  if(axislabel[x] == data[i].QuarterNumber){
                    if(Number(x) < barnum){
                      if($('#unit').val() == 1){
                        average.push(Number(data[i].Sum000).toFixed(2))
                      }else{
                        average.push(Number(data[i].SumATV).toFixed(2))
                      }
                      lableexist = true;
                      break;
                    }
                  }
                }
                if(lableexist == false){
                  average.push(Number(0).toFixed(2));
                }

                break;
              case '5' :

                break;
            }
          }
          dataseries = [{
            name: graphlegend[0],
            type: magicType,            
            stack : 'stack',
            label: {
                normal: {
                    show: false,
                    color : '#000',
                    fontSize: 9,
                    position: 'top',
                    formatter : '{c}'
                }
            },
            itemStyle : {
              normal : {
                color : barcolor
              },
              emphasis : {
                color : barcolor
              }
            },            
            data: average,
          }]
          var topxAxis = average;
        }else{
          console.log(data)
          for(var i in PFormIDs){
            for(var t in trendinglegend){
              if(trendinglegend[t].PlatFormID == PFormIDs[i]){
                var multilegend = trendinglegend[t].PlatFormName
                break;
              }
            }
            var average = []
            for(var ii in axislabel){
              average.push(Number(0))
            }
            for(var x in axislabel){
              for(var d in data){
                switch(num){
                  case '1' :
                    var tempDate = data[d].ProgDate
                    break;
                  case '2' :
                    var tempDate = data[d].WeekNumber
                    break;
                  case '3' :
                    var tempDate = data[d].MonthNumber
                    break;
                  case '4' :
                    var tempDate = data[d].QuarterNumber
                    break;
                  case '5' :
                    var tempDate = data[d].YearNumber
                    break;
                }
                //console.log(PFormIDs[i] +'=='+ data[d].PlatFormID + '/' + axislabel[x] +"=="+tempDate)
                if(PFormIDs[i] == data[d].PlatFormID && axislabel[x] == tempDate){
                  if($('#unit').val() == 1){
                    average[x] = Number(data[d].Sum000).toFixed(2)
                  }else{
                    average[x] = Number(data[d].SumATV).toFixed(2)
                  }
                  var barcolor = data[d].ColorCode;
                }
              }
            }
            console.log(average)
            dataseries.push({
              name: multilegend,
              type: magicType,              
              stack : 'stack',
              label: {
                  normal: {
                      show: false,
                      color : '#000',
                      fontSize: 9,
                      position: 'top',
                      formatter : '{c}'
                  }
              },
              itemStyle : {
                normal: {
                    barBorderWidth: 0,
                    barBorderColor: barcolor,
                    color: barcolor
                },
                emphasis: {
                  barBorderColor: barcolor,
                  color: barcolor
                }
              },              
              data: average,
            })
          }
          var topxAxis = []
          for(var i in axislabel){
            if(Number(i) < barnum){
              var sum = 0;
              for(var x in data){
                switch(num){
                  case '1' :
                    if(axislabel[i] == data[x].ProgDate){
                      if($('#unit').val() == 1){
                        sum += parseFloat(Number(data[x].Sum000).toFixed(2))
                      }else{
                        sum += parseFloat(Number(data[x].SumATV).toFixed(2))
                      }
                    }
                    break;
                  case '2' :
                    if(axislabel[i] == data[x].WeekNumber){
                      console.log(axislabel[i] +"=="+ data[x].WeekNumber)
                      if($('#unit').val() == 1){
                        sum += parseFloat(Number(data[x].Sum000).toFixed(2))
                      }else{
                        sum += parseFloat(Number(data[x].SumATV).toFixed(2))
                      }
                    }
                    break;
                  case '3' :
                    if(axislabel[i] == data[x].MonthNumber){
                      if($('#unit').val() == 1){
                        sum += parseFloat(Number(data[x].Sum000).toFixed(2))
                      }else{
                        sum += parseFloat(Number(data[x].SumATV).toFixed(2))
                      }
                    }
                    break;
                  case '4' :
                    if(axislabel[i] == data[x].QuarterNumber){
                      if($('#unit').val() == 1){
                        sum += parseFloat(Number(data[x].Sum000).toFixed(2))
                      }else{
                        sum += parseFloat(Number(data[x].SumATV).toFixed(2))
                      }
                    }
                    break;
                  case '5' :
                    if(axislabel[i] == data[x].YearNumber){
                      if($('#unit').val() == 1){
                        sum += parseFloat(Number(data[x].Sum000).toFixed(2))
                      }else{
                        sum += parseFloat(Number(data[x].SumATV).toFixed(2))
                      }
                    }
                    break;
                }
              }
              topxAxis.push(sum)
            }
          }
          console.log(topxAxis)
          for(var i in topxAxis){
            topxAxis[i] = Number(topxAxis[i]).toFixed(2)
          }
        }

        function selected(){
          if(graphlegend.length == 1){
            return true;
          }          
        }
        var echartBar = echarts.init(document.getElementById('bargraph'));                
        echartBar.on('magictypechanged', function(params) {
            magicType = params.currentType;
        });
        var excludelist = []
        echartBar.on('legendselectchanged', function(params) {                
          var isSelected = params.selected[params.name];                
          var SelectUnselect = (isSelected ? 'select' : 'unselect');
          console.log(SelectUnselect)
          console.log(params.name)          
          if(SelectUnselect == 'unselect'){
            excludelist.push(params.name)
          }else{
            excludelist.splice($.inArray(params.name, excludelist),1);
          }
          console.log(excludelist)
          var platformlist = []          
          for(var i in trendinglegend){
            var inlist = false;
            for(var x in excludelist){
              if(excludelist[x] == trendinglegend[i].PlatFormName){
                inlist = true;
                break;
              }
            }
            if(inlist == false){
              platformlist.push(trendinglegend[i].PlatFormID)
            }
          }
          console.log(platformlist)
          console.log(data)
          var legendtopxAxis = [];
          //trendinglegend.push({PlatFormID:data[i].PlatFormID,PlatFormName : data[i].PlatFormName})
          for(var i in axislabel){
            if(Number(i) < barnum){
              var sum = 0;
              for(var x in data){
                if($.inArray( data[x].PlatFormID, platformlist ) != -1){
                  switch(num){
                    case '1' :
                      if(axislabel[i] == data[x].ProgDate){
                        if($('#unit').val() == 1){
                          sum += parseFloat(Number(data[x].Sum000).toFixed(2))
                        }else{
                          sum += parseFloat(Number(data[x].SumATV).toFixed(2))
                        }
                      }
                      break;
                    case '2' :
                      if(axislabel[i] == data[x].WeekNumber){
                        console.log(axislabel[i] +"=="+ data[x].WeekNumber)
                        if($('#unit').val() == 1){
                          sum += parseFloat(Number(data[x].Sum000).toFixed(2))
                        }else{
                          sum += parseFloat(Number(data[x].SumATV).toFixed(2))
                        }
                      }
                      break;
                    case '3' :
                      if(axislabel[i] == data[x].MonthNumber){
                        if($('#unit').val() == 1){
                          sum += parseFloat(Number(data[x].Sum000).toFixed(2))
                        }else{
                          sum += parseFloat(Number(data[x].SumATV).toFixed(2))
                        }
                      }
                      break;
                    case '4' :
                      if(axislabel[i] == data[x].QuarterNumber){
                        if($('#unit').val() == 1){
                          sum += parseFloat(Number(data[x].Sum000).toFixed(2))
                        }else{
                          sum += parseFloat(Number(data[x].SumATV).toFixed(2))
                        }
                      }
                      break;
                    case '5' :
                      if(axislabel[i] == data[x].YearNumber){
                        if($('#unit').val() == 1){
                          sum += parseFloat(Number(data[x].Sum000).toFixed(2))
                        }else{
                          sum += parseFloat(Number(data[x].SumATV).toFixed(2))
                        }
                      }
                      break;
                  }
                }                
              }
              legendtopxAxis.push(sum)
            }
          }
          console.log(legendtopxAxis)
          for(var i in legendtopxAxis){
            legendtopxAxis[i] = Number(legendtopxAxis[i]).toFixed(2)
          }
          echartBar.on('magictypechanged', function(params) {
            magicType = params.currentType;
          });
          echartBar.setOption({
            title: {
                text: TrendingTitle,
                textStyle: {
                    fontSize: 20,
                    //fontFamily: 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif',
                    fontWeight: 'normal',
                    extraCssText: 'left: 0px'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                backgroundColor: 'rgba(245, 245, 245, 0.8)',
                borderWidth: 1,
                borderColor: '#ccc',
                formatter: '{b}: {c}',
                padding: 10,
                textStyle: {
                    color: '#000'
                },
                position: function(pos, params, el, elRect, size) {
                   var obj = {top: 10};
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                    return obj;
                },
                show : false,
                extraCssText: 'width: 170px'
            },
            toolbox: {
                show: true,
                feature: {
                    mark : {show: true},
                    dataView: {
                        show: false,
                        title: "Text View",
                        lang: [
                            "Text View",
                            "Close",
                            "Refresh",
                        ],
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['line', 'bar'],
                        title: {
                            line: 'Line Chart',
                            bar: 'Bar Chart',
                            stack: 'Stacked Chart',
                            tiled: 'Tiled Chart',
                        }
                    },
                    restore: {
                        show: false,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    },
                }
            },
            legend: {
                data: graphlegend,                
                show : true,
            },
            grid: {
                left: '60',
                right: '0%',
                bottom: '40',
                top: '20%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                name: $("#unit option:selected").text(),
                nameLocation: 'middle',
                nameGap: 60,
                nameTextStyle : {
                  fontSize : 14,
                },
                scale: 3,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                }
            },
            xAxis: [{
                    type: 'category',
                    data: axislabel,
                    name: $("#periodtype option:selected").text(),
                    nameLocation: 'middle',
                    nameGap: 40,
                    nameTextStyle : {
                      fontSize : 14,
                    }
                },
                {
                    type: 'category',
                    position: 'top',
                    onZero: true,
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    zAxisIndex: 1,
                    scale: true,
                    axisLabel: {
                        show: true,
                        /*formatter: '{value}' + PutPctg(),
                        textStyle: {
                            color: function(v) {
                                if (v >= 0) {
                                    return 'green'
                                } else {
                                    return 'red'
                                }
                            }
                        },*/
                    },
                    data: legendtopxAxis
                }
            ],
           calculable : true,
              series: dataseries
          })
        });
        echartBar.setOption({
          title: {
              text: TrendingTitle,
              textStyle: {
                  fontSize: 20,
                  //fontFamily: 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif',
                  fontWeight: 'normal',
                  extraCssText: 'left: 0px'
              }
          },
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross'
              },
              backgroundColor: 'rgba(245, 245, 245, 0.8)',
              borderWidth: 1,
              borderColor: '#ccc',
              formatter: '{b}: {c}',
              padding: 10,
              textStyle: {
                  color: '#000'
              },
              position: function(pos, params, el, elRect, size) {
                 var obj = {top: 10};
                  obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                  return obj;
              },
              show : false,
              extraCssText: 'width: 170px'
          },
          toolbox: {
              show: true,
              feature: {
                  mark : {show: true},
                  dataView: {
                      show: false,
                      title: "Text View",
                      lang: [
                          "Text View",
                          "Close",
                          "Refresh",
                      ],
                      readOnly: false
                  },
                  magicType: {
                      show: true,
                      type: ['line', 'bar'],
                      title: {
                          line: 'Line Chart',
                          bar: 'Bar Chart',
                          stack: 'Stacked Chart',
                          tiled: 'Tiled Chart',
                      }
                  },
                  restore: {
                      show: false,
                      title: "Restore"
                  },
                  saveAsImage: {
                      show: true,
                      title: "Save Image"
                  },
              }
          },
          legend: {
              data: graphlegend,
              selected : selected(),
              show : true,
          },
          grid: {
              left: '60',
              right: '0%',
              bottom: '40',
              top: '20%',
              containLabel: true
          },
          yAxis: {
              type: 'value',
              name: $("#unit option:selected").text(),
              nameLocation: 'middle',
              nameGap: 60,
              nameTextStyle : {
                fontSize : 14,
              },
              scale: 3,
              label: {
                  normal: {
                      show: true,
                      position: 'top'
                  }
              }
          },
          xAxis: [{
                  type: 'category',
                  data: axislabel,
                  name: $("#periodtype option:selected").text(),
                  nameLocation: 'middle',
                  nameGap: 40,
                  nameTextStyle : {
                    fontSize : 14,
                  }
              },
              {
                  type: 'category',
                  position: 'top',
                  onZero: true,
                  xAxisIndex: 1,
                  yAxisIndex: 1,
                  zAxisIndex: 1,
                  scale: true,
                  axisLabel: {
                      show: true,
                      /*formatter: '{value}' + PutPctg(),
                      textStyle: {
                          color: function(v) {
                              if (v >= 0) {
                                  return 'green'
                              } else {
                                  return 'red'
                              }
                          }
                      },*/
                  },
                  data: topxAxis
              }
          ],
          calculable : true,
          series: dataseries
        });
        base64 = new Image();
        base64.src = echartBar.getDataURL({
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
      })
    }else{
      $('#bargraph').html('')
    }

  },
  /*
  ===== Change value on period range
  */
  initperiod : function(periodtype){
    scrollNum = 0;
    switch(periodtype){
      case '1' :
        fytd = false;
        scrollLen = daterange.length - 1;
        $('#customperiod').val(daterange[0])
        break;
      case '2' :
        fytd = false;
        scrollLen = weekrange.length - 1;
        $('#customperiod').val(weekrange[0])
        break;
      case '3' :
        fytd = false;
        scrollLen = monthrange.length - 1;
        $('#customperiod').val(monthrange[0])
        break;
      case '4' :
        fytd = false;
        scrollLen = quarterrange.length - 1;
        $('#customperiod').val(quarterrange[0])
        break;
      case '5' :
        fytd = true;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yy = today.getFullYear();
        $('#customperiod').val('-fytd')
        if(Number(mm) < 6){
          fytdString = "-"+ Number(yy - 1);
        }else{
          fytdString = "-"+ Number(yy);
        }        
        console.log(fytdString)
        break;
    }
    navmodule.scrollproperty()
  },
  periodscroll : function(scrollType){
    if(scrollType == 'prev'){
      if(scrollLen > scrollNum){
        scrollNum++;
      }
    }else{
      if(scrollNum > 0){
        scrollNum--;
      }
    }
    var num = $('#periodtype').val()
    switch(num){
      case '1' :
        $('#customperiod').val(daterange[scrollNum])
        break;
      case '2' :
        $('#customperiod').val(weekrange[scrollNum])
        break;
      case '3' :
        $('#customperiod').val(monthrange[scrollNum])
        break;
      case '4' :
        $('#customperiod').val(quarterrange[scrollNum])
        break;
      case '5' :
        $('#customperiod').val(yearrange[scrollNum])
        break;
    }
    navmodule.scrollproperty()
  },
  scrollproperty : function(){
    navmodule.ChannelPerformanceRequest()
    if(scrollNum == 0 && scrollLen > 0){
      $('#next').prop('disabled',true)
      $('#prev').prop('disabled',false)
    }else if(scrollNum == 0 && scrollLen == 0){
      $('#prev').prop('disabled',true)
      $('#next').prop('disabled',true)
    }else if(scrollNum == scrollLen){
      $('#next').prop('disabled',false)
      $('#prev').prop('disabled',true)
    }else{
      $('#prev').prop('disabled',false)
      $('#next').prop('disabled',false)
    }
  }
}
/*
===== show/hide when channelgroup type ID is 1 or not
*/
function holdervisibility(ChannelID){
  if(ChannelID == 1){
    $('#channelgroupholder').fadeIn()
  }else{
    $('#channelgroupholder').fadeOut()
  }
}
function loadingstate(){
  box = bootbox.dialog({
    message: '<p class="text-center align-middle"><img height="40" src="icon/loading.gif"></p>',
    closeButton: false,
  });
  var dialog = box.find('.modal-dialog');
  box.css('display', 'block');
  dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
  $(document).ajaxStop(function() {
    box.modal('hide')
  });
}
$(function(){
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });  
  $('#programeperformance').scroll(function(){
    var appendoutput = '';
    if(page <= last_page){
      if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight){                           
        $.get(window.location.href + "programmeperformance", scrollrequest, function(result){                            
          console.log(result.data.data)
          var ShowFromTime =$('#periodtype').val() == 1 && scg == -1 && sch != -1 && scp == 1;      
          for(var i in result.data.data){
            if(ShowFromTime){
              var FirstFromTime = '<td>'+ result.data.data[i].FirstFromTime  +'</td>';
            }else{
              var FirstFromTime = '';
            }
            appendoutput += '<tr id="'+ result.data.data[i].BMICode +'" value="'+ result.data.data[i].ProgrammeTitle +'">'+
              '<td><span>'+ result.data.data[i].ProgrammeTitle+'</span></td>'+
              FirstFromTime +
              '<td>'+ result.data.data[i].BMICode +'</td>'+
              '<td>'+ result.data.data[i].CNT +'</td>' + 
              '<td>'+ Number(result.data.data[i].Sum000).toFixed(2) +'</td>'+              
            '</tr>';                
          }
          $('#programeperformance tbody').append(appendoutput)
          appendoutput = '';
          page++;
        });             
      }
    }          
  })
  $("#customperiod").datepicker({
      showOn: "button",
      buttonImage: "icon/datepicker.png",
      buttonImageOnly: true,
      buttonText: "Select date",
      constrainInput: false,
      dateFormat: "ddmmy",
      firstDay : 1,
      onSelect: function(dateText) {
        var char = $('#customperiod').val()
        clearTimeout(wto);
        wto = setTimeout(function() {
          if($('#customperiod').val().length == 6){
            if($.inArray( $('#customperiod').val(), daterange ) != -1){
              fytd = false;
              periodcheck = true;
              $('#periodtype').val(1)
              scrollNum = $.inArray( $('#customperiod').val(), daterange )
              navmodule.scrollproperty()
              $('#periodrange').val($('#customperiod').val())
            }else{
              periodcheck = false;
            }
          }
          if($('#customperiod').val().length == 4 && $.isNumeric(char.charAt(2)) == true ){
            if($.inArray( $('#customperiod').val(), weekrange ) != -1){
              fytd = false;
              periodcheck = true;
              $('#periodtype').val(2)
              scrollNum = $.inArray( $('#customperiod').val(), weekrange )
              navmodule.scrollproperty()
              $('#periodrange').val($('#customperiod').val())
            }else{
              periodcheck = false;
            }
          }
          if(($('#customperiod').val().length == 4 || $('#customperiod').val().length == 5) && (char.charAt(2) == 'm' || char.charAt(2) == 'M' ) ){
            fytd = false;
            if($.inArray( $('#customperiod').val(), monthrange ) != -1){
              periodcheck = true;
              $('#periodtype').val(3)
              scrollNum = $.inArray( $('#customperiod').val(), monthrange )
              navmodule.scrollproperty()
              $('#periodrange').val($('#customperiod').val())
            }else{
              periodcheck = false;
            }
          }
          if(($('#customperiod').val().length == 4 || $('#customperiod').val().length == 5) && (char.charAt(2) == 'q' || char.charAt(2) == 'Q') ){
            fytd = false;
            if($.inArray( $('#customperiod').val(), quarterrange ) != -1){
              periodcheck = true;
              $('#periodtype').val(4)
              scrollNum = $.inArray( $('#customperiod').val(), quarterrange )
              navmodule.scrollproperty()
              $('#periodrange').val($('#customperiod').val())
            }else{
              periodcheck = false;
            }
          }
          if($('#customperiod').val().length == 2){
            if($.inArray( $('#customperiod').val(), yearrange ) != -1){
              periodcheck = true;
              $('#periodtype').val(5)
              scrollNum = $.inArray( $('#customperiod').val(), yearrange )
              navmodule.scrollproperty()
              $('#periodrange').val($('#customperiod').val())
            }else{
              periodcheck = false;
            }
          }else{
            periodcheck = false;
          }
        },1000);
      }
  });
  navmodule.initnav($('#channelgroup').val(),'channelgroup',$('#periodtype').val())
  /*
  ===== Bind trigger for channelgroup
  */
  $(window).resize(function(){
    var channelscroll = $('#channelperformance').scrollTop()
    var programmescroll = $('#programeperformance').scrollTop()
    $('#channelperformance,#programeperformance').scrollTop(0)
    clearTimeout(wto);
    wto = setTimeout(function() {
      $('#channelperformance').scrollTop(Number(channelscroll+20))
      $('#programeperformance').scrollTop(Number(programmescroll+20))
    },10);
  })
  $('#exportchannel').click(function(){
    navmodule.exportchannel(channelreq);
  })
  $('#exportprogramme').click(function(){
    navmodule.exportprogramme(programmereq);
  })
  $('#exporttrending').click(function(){
    navmodule.exporttrending(trendingreq);
  })
  $('#dlchannel').click(function(){
    $(this).html("download again")
  })
  $('#dlprog').click(function(){
    $(this).html("download again")
  })
  $('#dltrend').click(function(){
    $(this).html("download again")
  })  
  $('#btnshowhideEx').click(function(){
    var minwidth;
    if($(this).attr('value') == 'hidden'){
      $(this).attr('value','shown')
      $(this).html('Minimize Export Module')            
      $('#exportcontainer').animate({
        width : '400px',
        height : '300px',
        right : '15px',
        bottom : '15px'      
      });
    }else{
      $(this).attr('value','hidden')
      $(this).html('Show Export Module')            
      $('#exportcontainer').animate({
        width : '180px',
        height : '30px',
        right : 0,
        bottom : 0
      });      
    }    
  })
  $('#channelview').on('change',function(){
    activeChannel = 0;
    activePlatForm = 0;
    holdervisibility($(this).val())
    navmodule.ChannelPerformanceRequest()
  })
  $('#channelgroup').on('change',function(){
    if(channelgroupid != 1 || $(this).val() != 1){
      activeChannel = 0;
      activePlatForm = 0; 
    }   
    navmodule.ChannelPerformanceRequest()      
    channelgroupid = $(this).val()
  })
  /*
  ===== Bind trigger for period range
  */
  $('#periodtype').on('change',function(){
    WPeriod = ''
    navmodule.initperiod($(this).val())
  })
  /*
  ===== Bind next period when #next is click
  */
  $('#next').click(function(){
    $('#customperiod').val('')
    WPeriod = ''
    navmodule.periodscroll('next')
  })
  /*
  ===== Bind pervious period when #prev is click
  */
  $('#prev').click(function(){
    $('#customperiod').val('')
    WPeriod = ''
    navmodule.periodscroll('prev')
  })
  /*
  ===== Bind prev and next when period changed
  */

  $('#unit').change(function(){
    navmodule.ChannelPerformanceRequest()
  })
  var tto;
  $('#barnum').on('input',function(){
    if($(this).val() != '' && $.isNumeric($(this).val()) == true && $(this).val() <= 15){
      clearTimeout(tto);
      tto = setTimeout(function(){
        navmodule.init_trending(TrendingProgTitleID,TrendingChannelGroupID,TrendingChannelID,TrendingPeriodTypeID,TrendingPeriod,TrendingPlatFormID,TrendingFilter)
      },1000)
    }
  })
  //daterange weekrange monthrange quarterrange yearrange
  $('#customperiod').on('input',function(){
    var char = $('#customperiod').val()
    clearTimeout(wto);
    wto = setTimeout(function() {
      if($('#customperiod').val() == "-fytd"){
        fytd = true;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yy = today.getFullYear();
        if(Number(mm) < 6){
          fytdString = "-"+ Number(yy - 1);
        }else{
          fytdString = "-"+ Number(yy);
        }        
        console.log(fytdString)
        $('#periodtype').val(5)  
        navmodule.ChannelPerformanceRequest()      
      }

      if($('#customperiod').val().length == 6){
        if($.inArray( $('#customperiod').val(), daterange ) != -1){
          fytd = false;
          periodcheck = true;
          $('#periodtype').val(1)
          scrollNum = $.inArray( $('#customperiod').val(), daterange )
          navmodule.scrollproperty()
          $('#periodrange').val($('#customperiod').val())
        }else{
          periodcheck = false;
        }
      }if($('#customperiod').val().length == 4 && $.isNumeric(char.charAt(2)) == true ){
        if($.inArray( $('#customperiod').val(), weekrange ) != -1){
          fytd = false;
          periodcheck = true;
          $('#periodtype').val(2)
          scrollNum = $.inArray( $('#customperiod').val(), weekrange )
          navmodule.scrollproperty()
          $('#periodrange').val($('#customperiod').val())
        }else{
          periodcheck = false;
        }
      }if(($('#customperiod').val().length == 4 || $('#customperiod').val().length == 5) && (char.charAt(2) == 'm' || char.charAt(2) == 'M' ) ){
        if($.inArray( $('#customperiod').val(), monthrange ) != -1){
          fytd = false;
          periodcheck = true;
          $('#periodtype').val(3)
          scrollNum = $.inArray( $('#customperiod').val(), monthrange )
          navmodule.scrollproperty()
          $('#periodrange').val($('#customperiod').val())
        }else{
          periodcheck = false;
        }
      }if(($('#customperiod').val().length == 4 || $('#customperiod').val().length == 5) && (char.charAt(2) == 'q' || char.charAt(2) == 'Q') ){
        if($.inArray( $('#customperiod').val(), quarterrange ) != -1){
          fytd = false;
          periodcheck = true;
          $('#periodtype').val(4)
          scrollNum = $.inArray( $('#customperiod').val(), quarterrange )
          navmodule.scrollproperty()
          $('#periodrange').val($('#customperiod').val())
        }else{
          periodcheck = false;
        }
      }if($('#customperiod').val().length == 2){
        if($.inArray( $('#customperiod').val(), yearrange ) != -1){
          periodcheck = true;
          $('#periodtype').val(5)
          scrollNum = $.inArray( $('#customperiod').val(), yearrange )
          navmodule.scrollproperty()
          $('#periodrange').val($('#customperiod').val())
        }else{
          periodcheck = false;
        }
      }else{
        periodcheck = false;
      }
    },1000);
  })

  $('#filterbmi').keydown(function(e){
    switch(e.which){
      case 13:
        if(listnum > 0){
          $('#filterbmi').val($( "#list li:nth-child("+ listnum +")" ).data('value'))
          filterexist = true
          navmodule.ChannelPerformanceRequest()
          $('.dropdown-content').hide();
          lilength = 0;
          $('#list').html('')
        }
      break;
      case 38: // up
        if(listnum > 0){
          listnum--;
          var $target = $('#list');
          if ($target.find("li").length > 0) {
              $('#list li').each(function(){
                $(this).removeClass('bg-light')
              })
              $( "#list li:nth-child("+ listnum +")" ).addClass('bg-light')
              if($('#list').scrollTop() > 0){
                $('#list').scrollTop(Number($('#list').scrollTop() - 40))
              }
          }
        }
      break;
      case 40: // down
        if(listnum < lilength){
          listnum++;
          var $target = $('#list');
          if ($target.find("li").length > 0) {
              $('#list li').each(function(){
                $(this).removeClass('bg-light')
              })
              $( "#list li:nth-child("+ listnum +")" ).addClass('bg-light')
              if(listnum >= 8){
                $('#list').scrollTop(Number($('#list').scrollTop() + 40))
              }
          }
        }
      break;
    }
  })

  $('#filterbmi').on('input',function(e){
    var filtertext = $(this).val()
    filterexist = false
    clearTimeout(wto);
    $('.dropdown-content').hide();
    wto = setTimeout(function() {
      request = {
        InputFilter : filtertext
      }
      if(filtertext != ''){
        $.get(window.location.href + "filtertitle", request,function(data){
          if(data.length > 0){
            var output = '';
            lilength = data.length
            for(var i in data){
              output += '<li data-value="'+data[i].ProgrammeTitle+'" title="'+ data[i].ProgrammeTitle +'">'+ data[i].ProgrammeTitle +'</li>'
            }
            $('#list').html(output)
            $('#list li').each(function(){
              $(this).click(function(){
                $('#filterbmi').val($(this).data('value'))
                filterexist = true
                activeChannel = 0;
                activePlatForm = 0;
                navmodule.ChannelPerformanceRequest()
                $('.dropdown-content').hide();
                lilength = 0;
                $('#list').html('')
              })
              $(this).hover(function(){
                listnum = Number($(this).index() + 1);
                $('#list li').each(function(){
                  $(this).removeClass('bg-light')
                })
                //$(this).addClass('bg-light')
                $( "#list li:nth-child("+ Number($(this).index() + 1) +")" ).addClass('bg-light')
              })
            })
            $('#list').scrollTop(0)
            $('.dropdown-content').show();
          }else{
            lilength = 0;
            $('.dropdown-content').hide();
          }
        })
      }else{
        filterexist = false;
        activeChannel = filteractivechannel;
        activePlatForm = filteractiveplatform;
        navmodule.ChannelPerformanceRequest()
        $('.dropdown-content').hide();
        $('#list').html('')
      }

    }, 1000);

  })
  $('#emptyfilter').click(function(){
    $('#filterbmi').val('')
    filterexist = false;
    activeChannel = filteractivechannel;
    activePlatForm = filteractiveplatform;
    navmodule.ChannelPerformanceRequest()
    $('.dropdown-content').hide();
    $('#list').html('')
  })
  function parsedperiod(cperiod){
    var character = cperiod.charAt(2)
    if(cperiod.length == 4 && $.isNumeric(cperiod)){
      WPeriod = '20' + '' + cperiod
      if($.inArray( WPeriod, weekrange ) != -1){
        $('#periodtype').val(2)
        scrollNum = $.inArray( WPeriod, weekrange )
      }
      navmodule.scrollproperty()
    }else if((cperiod.length == 4 || cperiod.length == 5) && (character == 'm' || character == 'M')){
      if(cperiod.length == 4){
        WPeriod = '20' + cperiod.substring(0, 2) + '0' + cperiod.substring(3, 4);
      }else if(cperiod.length == 5){
        WPeriod = '20' + cperiod.substring(0, 2) + '' + cperiod.substring(3, 5);
      }
      if($.inArray( WPeriod, monthrange ) != -1){
        $('#periodtype').val(3)
        scrollNum = $.inArray( WPeriod, monthrange )
      }
      navmodule.scrollproperty()
    }else if((cperiod.length == 4 || cperiod.length == 5) && (character == 'q' || character == 'Q')){
      if(cperiod.length == 4){
        WPeriod = '20' + cperiod.substring(0, 2) + '0' + cperiod.substring(3, 4);
      }else if(cperiod.length == 5){
        WPeriod = '20' + cperiod.substring(0, 2) + '' + cperiod.substring(3, 5);
      }
      if($.inArray( WPeriod, quarterrange ) != -1){
        $('#periodtype').val(4)
        scrollNum = $.inArray( WPeriod, quarterrange )
      }
      navmodule.scrollproperty()
    }else{
      WPeriod = '';
    }
  }

  function periodrange(num){
    switch(num){
      case '1' :
        if($('#customperiod').val().length == 6){
          if($.inArray( $('#customperiod').val(), daterange ) != -1){
            fytd = false;
            periodcheck = true;
            scrollNum = $.inArray( $('#customperiod').val(), daterange )
            navmodule.scrollproperty()
            $('#periodrange').val($('#customperiod').val())
          }else{
            periodcheck = false;
          }
        }else{
          periodcheck = false;
        }
        break;
      case '2' :
        if($('#customperiod').val().length == 6){
          if($.inArray( $('#customperiod').val(), weekrange ) != -1){
            fytd = false;
            periodcheck = true;
            scrollNum = $.inArray( $('#customperiod').val(), weekrange )
            navmodule.scrollproperty()
            $('#periodrange').val($('#customperiod').val())
          }else{
            periodcheck = false;
          }
        }else{
          periodcheck = false;
        }
        break;
      case '3' :
        if($('#customperiod').val().length == 6){
          if($.inArray( $('#customperiod').val(), monthrange ) != -1){
            fytd = false;
            periodcheck = true;
            scrollNum = $.inArray( $('#customperiod').val(), monthrange )
            navmodule.scrollproperty()
            $('#periodrange').val($('#customperiod').val())
          }else{
            periodcheck = false;
          }
        }else{
          periodcheck = false;
        }
        break;
      case '4' :
        if($('#customperiod').val().length == 6){
          if($.inArray( $('#customperiod').val(), quarterrange ) != -1){
            fytd = false;
            periodcheck = true;
            scrollNum = $.inArray( $('#customperiod').val(), quarterrange )
            navmodule.scrollproperty()
            $('#periodrange').val($('#customperiod').val())
          }else{
            periodcheck = false;
          }
        }else{
          periodcheck = false;
        }
        break;
      case '5' :
        if($('#customperiod').val().length == 4){
          if($.inArray( $('#customperiod').val(), yearrange ) != -1){
            periodcheck = true;
            scrollNum = $.inArray( $('#customperiod').val(), yearrange )
            navmodule.scrollproperty()
            $('#periodrange').val($('#customperiod').val())
          }else{
            periodcheck = false;
          }
        }else{
          periodcheck = false;
        }
        break;
    }
  }

})
