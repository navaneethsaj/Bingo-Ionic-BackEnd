(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{"9d0U":function(l,n,u){"use strict";u.r(n);var t=u("8Y7J");class o{}var e=u("pMnS"),i=u("MKJQ"),r=u("sZkV"),a=u("SVse"),c=u("s7LF"),b=u("mNHU"),s=u("gag3"),h=u("wd/R");class p{constructor(l,n){this.gameinstanceService=l,this.router=n,this.chatroomlist=[],this.chatroomsocket=io(s.a.baseurl+"/chatroom"),this.chatroomsocket.on("connect",()=>{console.log("chatroom connected",this.chatroomsocket.id),this.chatroomsocket.on("disconnect",()=>{console.log("disconnect chatroom")})})}ngOnInit(){this.chatroomsocket.on("chatroom",l=>{if("/chatroom"===this.router.url){if(this.chatroomlist.length>0&&this.chatroomlist[this.chatroomlist.length-1].time===l.list[l.list.length-1].time)return void console.log("retrned");this.chatroomlist=l.list,setTimeout(()=>{this.content.scrollToBottom(1e3),console.log("scroll")},100)}})}ionViewWillLeave(){this.gameinstanceService.socket.off("chatroom"),console.log("chat unsubscribed")}sendMessage(l,n,u){const t=localStorage.getItem("username")||"Guest";!0===n&&(l={value:String(Math.floor(Math.random()*(999999e9+1))+999999999)}),!0===u&&(l={value:l+"'s challenge accepted by "+t}),l.value.length<1||(this.chatroomsocket.emit("chatroom",{username:t,msg:l.value,challenge:n,joined:u}),l.value="")}formatTime(l){return h(l).fromNow()}}var m=u("iInd"),d=t.nb({encapsulation:0,styles:[[""]],data:{}});function g(l){return t.Fb(0,[(l()(),t.pb(0,0,null,null,6,"div",[["style","width: 60%; margin: 3vw; padding: 3vw; background: #afebed; border-bottom-left-radius: 5vw; border-bottom-right-radius: 5vw; border-top-right-radius: 5vw"]],null,null,null,null,null)),(l()(),t.pb(1,0,null,null,1,"div",[["style","font-size: 3vw"]],null,null,null,null,null)),(l()(),t.Eb(2,null,["",""])),(l()(),t.pb(3,0,null,null,1,"div",[["style","padding: 0.5vh; font-size: 3.5vw"]],null,null,null,null,null)),(l()(),t.Eb(4,null,["",""])),(l()(),t.pb(5,0,null,null,1,"div",[["style","font-size: 2.5vw; text-align: right"]],null,null,null,null,null)),(l()(),t.Eb(6,null,["",""]))],null,(function(l,n){var u=n.component;l(n,2,0,n.parent.context.$implicit.username),l(n,4,0,n.parent.context.$implicit.msg),l(n,6,0,u.formatTime(n.parent.context.$implicit.time))}))}function v(l){return t.Fb(0,[(l()(),t.pb(0,0,null,null,13,"div",[["style","width: 90%; margin: 3vw; padding: 3vw; background: #DCF8C6; border-bottom-left-radius: 5vw; border-bottom-right-radius: 5vw; border-top-right-radius: 5vw"]],null,null,null,null,null)),(l()(),t.pb(1,0,null,null,12,"ion-row",[["style","padding: 0; margin:0; font-size: 3vw"]],null,null,null,i.Z,i.v)),t.ob(2,49152,null,0,r.db,[t.h,t.k,t.x],null,null),(l()(),t.pb(3,0,null,0,3,"ion-col",[["style","padding: 0; margin:0;"]],null,null,null,i.M,i.i)),t.ob(4,49152,null,0,r.q,[t.h,t.k,t.x],null,null),(l()(),t.pb(5,0,null,0,1,"div",[["style","font-size: 3.5vw; margin-top: 2vw"]],null,null,null,null,null)),(l()(),t.Eb(6,null,["",""])),(l()(),t.pb(7,0,null,0,6,"ion-col",[["style","padding: 0; margin:0; text-align: end"]],null,null,null,i.M,i.i)),t.ob(8,49152,null,0,r.q,[t.h,t.k,t.x],null,null),(l()(),t.pb(9,0,null,0,4,"ion-chip",[["color","primary"],["style","font-size: 4vw; margin: 0"]],null,[[null,"click"]],(function(l,n,u){var t=!0,o=l.component;return"click"===n&&(o.gameinstanceService.replay(l.parent.context.$implicit.msg||"9999"),o.router.navigateByUrl("tabs/tab1"),o.sendMessage(l.parent.context.$implicit.username,!1,!0),t=!1!==(o.gameinstanceService.searchbarText=l.parent.context.$implicit.msg)&&t),t}),i.L,i.h)),t.ob(10,49152,null,0,r.p,[t.h,t.k,t.x],{color:[0,"color"]},null),(l()(),t.pb(11,0,null,0,2,"ion-label",[["style","font-size: 4vw"]],null,null,null,i.X,i.t)),t.ob(12,49152,null,0,r.K,[t.h,t.k,t.x],null,null),(l()(),t.Eb(-1,0,["Join"]))],(function(l,n){l(n,10,0,"primary")}),(function(l,n){l(n,6,0,n.parent.context.$implicit.username+" challenged")}))}function f(l){return t.Fb(0,[(l()(),t.pb(0,0,null,null,2,"div",[["style","font-size: 3vw; width: 60%; margin: 3vw; padding: 3vw; background: #f7f7db; border-bottom-left-radius: 5vw; border-bottom-right-radius: 5vw; border-top-right-radius: 5vw"]],null,null,null,null,null)),(l()(),t.pb(1,0,null,null,1,"div",[["style","padding: 0.5vh;"]],null,null,null,null,null)),(l()(),t.Eb(2,null,["",""]))],null,(function(l,n){l(n,2,0,n.parent.context.$implicit.msg)}))}function w(l){return t.Fb(0,[(l()(),t.pb(0,0,null,null,6,"div",[],null,null,null,null,null)),(l()(),t.eb(16777216,null,null,1,null,g)),t.ob(2,16384,null,0,a.i,[t.M,t.J],{ngIf:[0,"ngIf"]},null),(l()(),t.eb(16777216,null,null,1,null,v)),t.ob(4,16384,null,0,a.i,[t.M,t.J],{ngIf:[0,"ngIf"]},null),(l()(),t.eb(16777216,null,null,1,null,f)),t.ob(6,16384,null,0,a.i,[t.M,t.J],{ngIf:[0,"ngIf"]},null)],(function(l,n){l(n,2,0,!n.context.$implicit.challenge&&!n.context.$implicit.joined),l(n,4,0,n.context.$implicit.challenge),l(n,6,0,n.context.$implicit.joined)}),null)}function y(l){return t.Fb(0,[t.Cb(402653184,1,{content:0}),(l()(),t.pb(1,0,null,null,6,"ion-header",[],null,null,null,i.T,i.p)),t.ob(2,49152,null,0,r.y,[t.h,t.k,t.x],null,null),(l()(),t.pb(3,0,null,0,4,"ion-toolbar",[],null,null,null,i.hb,i.D)),t.ob(4,49152,null,0,r.wb,[t.h,t.k,t.x],null,null),(l()(),t.pb(5,0,null,0,2,"ion-title",[],null,null,null,i.gb,i.C)),t.ob(6,49152,null,0,r.ub,[t.h,t.k,t.x],null,null),(l()(),t.Eb(-1,0,["Chat Room"])),(l()(),t.pb(8,0,null,null,5,"ion-content",[],null,null,null,i.N,i.j)),t.ob(9,49152,[[1,4]],0,r.r,[t.h,t.k,t.x],{scrollEvents:[0,"scrollEvents"]},null),(l()(),t.pb(10,0,null,0,3,"ion-list",[],null,null,null,i.Y,i.u)),t.ob(11,49152,null,0,r.L,[t.h,t.k,t.x],null,null),(l()(),t.eb(16777216,null,0,1,null,w)),t.ob(13,278528,null,0,a.h,[t.M,t.J,t.q],{ngForOf:[0,"ngForOf"]},null),(l()(),t.pb(14,0,null,null,15,"ion-footer",[],null,null,null,i.R,i.n)),t.ob(15,49152,null,0,r.w,[t.h,t.k,t.x],null,null),(l()(),t.pb(16,0,null,0,4,"ion-item",[],null,null,null,i.W,i.s)),t.ob(17,49152,null,0,r.E,[t.h,t.k,t.x],null,null),(l()(),t.pb(18,0,null,0,2,"ion-button",[],null,[[null,"click"]],(function(l,n,u){var t=!0;return"click"===n&&(t=!1!==l.component.sendMessage(null,!0,!1)&&t),t}),i.F,i.b)),t.ob(19,49152,null,0,r.h,[t.h,t.k,t.x],null,null),(l()(),t.Eb(-1,0,["Challenge"])),(l()(),t.pb(21,0,null,0,8,"ion-item",[],null,null,null,i.W,i.s)),t.ob(22,49152,null,0,r.E,[t.h,t.k,t.x],null,null),(l()(),t.pb(23,0,null,0,3,"ion-input",[["placeholder","type here..."]],null,[[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var o=!0;return"ionBlur"===n&&(o=!1!==t.Ab(l,26)._handleBlurEvent(u.target)&&o),"ionChange"===n&&(o=!1!==t.Ab(l,26)._handleInputEvent(u.target)&&o),o}),i.V,i.r)),t.Bb(5120,null,c.b,(function(l){return[l]}),[r.Hb]),t.ob(25,49152,[["message",4]],0,r.D,[t.h,t.k,t.x],{placeholder:[0,"placeholder"]},null),t.ob(26,16384,null,0,r.Hb,[t.k],null,null),(l()(),t.pb(27,0,null,0,2,"ion-button",[],null,[[null,"click"]],(function(l,n,u){var o=!0;return"click"===n&&(o=!1!==l.component.sendMessage(t.Ab(l,25),!1,!1)&&o),o}),i.F,i.b)),t.ob(28,49152,null,0,r.h,[t.h,t.k,t.x],null,null),(l()(),t.Eb(-1,0,["Send"]))],(function(l,n){var u=n.component;l(n,9,0,!0),l(n,13,0,u.chatroomlist),l(n,25,0,"type here...")}),null)}function k(l){return t.Fb(0,[(l()(),t.pb(0,0,null,null,1,"app-chatroom",[],null,null,null,y,d)),t.ob(1,114688,null,0,p,[b.a,m.m],null,null)],(function(l,n){l(n,1,0)}),null)}var x=t.lb("app-chatroom",p,k,{},{},[]);class E{}u.d(n,"ChatroomPageModuleNgFactory",(function(){return M}));var M=t.mb(o,[],(function(l){return t.xb([t.yb(512,t.j,t.X,[[8,[e.a,x]],[3,t.j],t.v]),t.yb(4608,a.k,a.j,[t.s,[2,a.q]]),t.yb(4608,c.g,c.g,[]),t.yb(4608,r.a,r.a,[t.x,t.g]),t.yb(4608,r.Bb,r.Bb,[r.a,t.j,t.p]),t.yb(4608,r.Eb,r.Eb,[r.a,t.j,t.p]),t.yb(1073742336,a.b,a.b,[]),t.yb(1073742336,c.f,c.f,[]),t.yb(1073742336,c.a,c.a,[]),t.yb(1073742336,r.yb,r.yb,[]),t.yb(1073742336,m.o,m.o,[[2,m.t],[2,m.m]]),t.yb(1073742336,E,E,[]),t.yb(1073742336,o,o,[]),t.yb(1024,m.k,(function(){return[[{path:"",component:p}]]}),[])])}))}}]);