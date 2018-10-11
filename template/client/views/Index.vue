<template>
  <div class="max600">
   <mt-header  title="登录" class="bg_white"></mt-header>
   <div class="page-header" v-show="!logined">
            <mt-field label="用户名" placeholder="请输入用户名" v-model="username" ></mt-field>
            <mt-field label="密码"   placeholder="请输入密码" type="password" v-model="password"></mt-field>
             
            <mt-button type="primary" size="large" @click="login"  >登录</mt-button>
    </div>
     <div class="page-header" v-show="logined">
             
            <mt-cell :title="welcome"><div @click="logout">退出</div></mt-cell>
            <mt-button type="primary" size="large" @click="gotoMain" > 开始</mt-button>
         </div>
  </div>
</template>

<script>
import axios from "axios" ;
import {Toast } from 'mint-ui'
import Auth from 'components/Auth'

const qs = require('qs')
export default {
    data:function(){
        return {
            username:this.$store.state.username,
            password:"",
            logined:false,
            welcome:"你已经登录了",
        }
    },
    methods:{
        gotoMain(){
          //this.$router.push("/main")
        },
        logout(){

            let userid=this.$store.state.userid
            if(userid<=0){
                console.log("err: userid:",userid)
                return
            }
            let that=this

            axios.delete(this.$store.state.base+"/v3/token/"+userid,Auth.Header(this)).then(function(response){
                if(response.status==200){
                    console.log(response.data)
                    that.$store.commit('saveUser',{user_name:"",real_name:'',user_id:-1})
                    that.$store.commit('saveToken','')
                    that.logined=false
                }else{
                    console.log("err:",response.status)
                }
            }).catch(function(error){
                console.log("error:",error)
                if(error.response && error.response.status==400){
                    that.$store.commit('saveUser',{user_name:"",real_name:'',user_id:-1})
                    that.$store.commit('saveToken','')
                    that.logined=false
                }
            })
        },
        login:function(){

            if(this.username.length==0 || this.password.length==0){
                 Toast({
                    message: "请输入用户名/密码！",
                    position: 'bottom',
                    duration: 5000
                })
                return
            }
            let that=this

            axios.post(this.$store.state.base+"/v3/code",qs.stringify({name:this.username})).then(function(res){
                // console.log(response.data)
                let code=res.data.code
                let authCode=Auth.toAuthCode(that.password,code)
                axios.post(that.$store.state.base+"/v3/login",qs.stringify({"name":that.username,"password":authCode,'code':code,'identity':'S','from':'myprj'})).then(function(response){
                    console.log(response.data)
                    console.log(response.status)

                    if(response.status>=200 && response.status<300){
                        let token=response.headers["x-auth-token"]
                        console.log("token=",token)
                        let d=response.data
                        that.$store.commit('saveUserName',that.username)
                        that.$store.commit('saveUser',{user_name:d.user_name,real_name:d.real_name,user_id:d.user_id})
                        that.$store.commit('saveToken',token)
                        that.logined=true
                        console.log('登录成功！')
                        that.$router.push("/")

                    }else{
                        console.log("err1")
                        Toast({
                        message: 'err：'+response.status,
                        position: 'bottom',
                        duration: 5000
                        })
                    }
                }).catch(function(err){
                    console.log("err2",err)
                    if(err.response){
                        Toast({
                            message: err.response.data.message,
                            position: 'bottom',
                            duration: 5000
                        })
                    }
                    //  console.log(err.response.data.message)
                });
            }).catch(function(err){
                console.log("error",err)
            })
            
            
            // 
        }
    },
    mounted() {
        console.log(this.$store.state.token)
        if(this.$store.state.token.length>0){
            this.welcome=this.$store.state.realname+",你好！"
            this.logined=true
        }else{
            this.logined=false
        }
    },
}
</script>
<style>
.max600{
  max-width: 600px;
  margin: auto auto;
}
.page-header{
  padding: 15px 15px;
}
.page-header button {
  padding: 10px;
}
</style>
