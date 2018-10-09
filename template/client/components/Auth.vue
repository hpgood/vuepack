<script>
// 1.0 兼容旧版本的登录
import des from 'des.js'
import MD5 from 'md5.js'
import {Buffer} from 'buffer'

export default {
    Header(that){
        let token="token "+that.$store.state.token
        return {headers:{Authorization:token}}
    },
    hasToken(that){
        let token=that.$store.state.token
        return token.length>0
    },
    checkErr(that,error,target){
        if(error.response && error.response.status==403){
            console.log("你没有访问的权限。")
            that.$router.push(target)
        }
    },
    toAuthCode(word,code){
        let m=new MD5().update(word).digest('hex')
        let key = Buffer.from(m.substring(0,8))
        let word_code = Buffer.from(word+","+code)
        //ECB pkcs5padding/pkcs7padding
        var enc = des.DES.create({
          type: 'encrypt',
          key: key
        });
        var out = new Buffer(enc.update(word_code).concat(enc.final()))
        return out.toString('hex')
    }
}
</script>
