        window.myTimer;
        window.data;
        window.rockets;
        var work_year ;
        var work_rocket ;

        function getData(url)
        {   //Retrieves the previous or next data from SpaceX
            clcTimeOuts(); 
            var ourRequest= new XMLHttpRequest()
 
            ourRequest.open('GET',url,true);
            ourRequest.onload =function()
            { 
             window.data= JSON.parse(ourRequest.responseText);
             getLength(window.data);
             document.getElementById("flight_number").innerHTML="Flight Number : "+  window.data["flight_number"];
             document.getElementById("mission_name").innerHTML="Misson Name : "+  window.data["mission_name"];
             document.getElementById("rocket_name").innerHTML="Rocket Name : "+  window.data.rocket["rocket_name"];
             document.getElementById("launch_site_name").innerHTML="Launch Site Name : "+  window.data.launch_site["site_name"];
             
             getCountdown(data["launch_date_unix"]);
            }
             ourRequest.send();
        }
        
        function getCountdown(time)
        {
            //Shows the countdown timer or the time the rocket was launched.
            clcIntervals();
            if(time*1000 > Date.now())
            {
            var timestamp = (time*1000) - Date.now();
            timestamp /= 1000; 

            window.myTimer = setInterval(function()
            {  
            timestamp--; 

            var days    = component(timestamp, 24 * 60 * 60),      
            hours   = component(timestamp,      60 * 60) % 24, 
            minutes = component(timestamp,           60) % 60, 
            seconds = component(timestamp,            1) % 60; 
            
            document.getElementById("launch_state").innerHTML="Will be launched " +  days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds"
                 
            }, 1000);     
            }

            else
            {
            var launchedDate = new Date(time*1000)
            clearInterval(window.myTimer);
  
            document.getElementById("launch_state").innerHTML = null;
            document.getElementById("launch_state").innerHTML ="Launched "+ launchedDate;  
            }

        }

        function getFlightNumber()
        {   
            //Gets the flight number in input.
            var fnumber = document.getElementById("f_number").value ;
            getByFlightNumber('https://api.spacexdata.com/v3/launches?flight_number='+fnumber);
        }

        function getByFlightNumber(url)
        {
            //Returns the data of the desired flight number.
            clcTimeOuts(); 
            var ourRequest= new XMLHttpRequest()
 
            ourRequest.open('GET',url,true);
            ourRequest.onload =function()
            { 
             window.data= JSON.parse(ourRequest.responseText);
             getLength(window.data);
             document.getElementById("flight_number").innerHTML ="Flight Number : "+  window.data[0].flight_number;
             document.getElementById("mission_name").innerHTML ="Mission Name : "+  window.data[0].mission_name;
             document.getElementById("rocket_name").innerHTML ="Rocket Name : "+  window.data[0].rocket.rocket_name
             document.getElementById("launch_site_name").innerHTML ="Launch Site Name : "+  window.data[0].launch_site.site_name
             
             getCountdown( window.data[0].launch_date_unix);
            }
    
            ourRequest.send();
        }


        function getRockets()
        {
            //Gets all rocket names and adds them to the selection list.
            var url = "https://api.spacexdata.com/v3/rockets";
            var ourRequest= new XMLHttpRequest()

            ourRequest.open('GET',url,true);
            ourRequest.onload =function()
            { 
            window.rockets= JSON.parse(ourRequest.responseText);
            getLength(window.rockets);
            for(var i =0; i<window.rockets.length;i++)
            {
                 var rocket = document.getElementById("rockets");
                 var rocket_name = document.createElement("option");
                 rocket_name.text = window.rockets[i].rocket_name;
                 rocket.add(rocket_name); 
            } 
            }
            ourRequest.send();

        }

        function getByRockets()
        {
            //Filters all flights according to the selected rocket name.
            clcTimeOuts();
            var select = document.getElementById("rockets");
            var selected = select.options[select.selectedIndex].text;
            var url = "https://api.spacexdata.com/v3/launches?rocket_name="+selected

            var ourRequest= new XMLHttpRequest()

            ourRequest.open('GET',url,true);
            ourRequest.onload =function()
            { 
            window.data= JSON.parse(ourRequest.responseText);
            getLength(window.data)
            for(var i =0 ;i<window.data.length;i++)
            {        
               work_rocket= setTimeout(writeByRocket,i*5000,window.data,i);
            }      
            }
            ourRequest.send();
        }

        function writeByRocket(data,i)
        {
            //Displays data one by one according to the selected rocket name every 5 seconds.
            document.getElementById("flight_number").innerHTML ="Flight Number : "+ data[i].flight_number;
            document.getElementById("mission_name").innerHTML ="Mission Name : "+ data[i].mission_name;
            document.getElementById("rocket_name").innerHTML ="Rocket Name : "+ data[i].rocket.rocket_name
            document.getElementById("launch_site_name").innerHTML ="Launch Site Name : "+ data[i].launch_site.site_name
            getCountdown(data[i].launch_date_unix);

        }

        function clcTimeOuts()
        {
            //stops all timeouts waiting to run.
            while (work_year>=0)
            {
                clearTimeout(work_year); 
                work_year--;
            }  
            while(work_rocket>=0)
            {
                clearTimeout(work_rocket); 
                work_rocket--;
            }
            
        }

        function clcIntervals()
        {
            while (window.myTimer>=0)
            {
                clearTimeout(window.myTimer); 
                window.myTimer--;
            }    
        }

        

        function component(x, v)
        {
        return Math.floor(x / v);
        }

        function getLength(getLength)
        {
            if (getLength==0 )
            {
                alert("Cannot found");
            }

        }

       
   