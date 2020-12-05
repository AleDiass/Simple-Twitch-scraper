const readline = require('readline');
const puppeteer = require('puppeteer');


const inputUser = readline.createInterface({
  input:process.stdin,
  output:process.stdout
})

inputUser.question("Twitch User Target: " , (response)=>{
  UserTarget = response;
  inputUser.close();
  if(UserTarget){
    StartPuppeteer(UserTarget.toLowerCase())
  }else{
    console.log('Insert a Valid User')
  }

  })




const StartPuppeteer = async(User) => {
    
  
    console.log("Starting Services.... Await") 
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.goto('http://twitch.com/' + User,{waitUntil:"networkidle2",timeout:0});
    
     
    
    const CheckUserStatus = await page.evaluate(()=>{
      
     try{
       
      const OfflineCheck = document.getElementsByClassName('channel-status-info channel-status-info--offline tw-border-radius-medium tw-inline-block')[0];
      const OnlineCheck = document.getElementsByClassName('tw-strong tw-upcase tw-white-space-nowrap')[0]
    
      if(!OfflineCheck && !OnlineCheck){
        return {error:"User not Found"}

      }
      else if(OfflineCheck){
        
        return {online:false , error:false}
      }
      else if(OnlineCheck){
        const viewers = document.querySelector("p[data-a-target='animated-channel-viewers-count']").innerText
        const StreamTime = document.getElementsByClassName('live-time')[0].innerText
        const title = document.querySelector("h2[data-a-target]").innerText;
        const game = document.querySelector("a[data-a-target=stream-game-link] span").innerText;
        return {online:true,viewers,StreamTime, title , game ,error:false}
      }

      
     }catch(e){
        console.log('Error 504 Try Again')
     }
      

    })
  
    if(CheckUserStatus.error){
      console.log(" \n \n " + CheckUserStatus.error)
    }
    if(!CheckUserStatus.online && !CheckUserStatus.error){
      console.log(` \n \n ${User} is Offline`)
    }
    if(CheckUserStatus.online){
      console.log(` \n \n User: ${User} \n Game: ${CheckUserStatus.game} \n Live Stream Started At: \n ${CheckUserStatus.StreamTime} \n spectators: ${CheckUserStatus.viewers} \n Stream Title: \n """ \n ${CheckUserStatus.title} \n\n"""`, )
    }
      
    
      browser.close();

}; 