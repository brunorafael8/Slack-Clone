<template>
        <div>
        <div class="login__container ui middle aligned center aligned grid">
            <div class="column">
                <h2 class="ui header">
                <img src="../assets/Slack_icons.svg" class="logo">
                <div class="content">
                    Slack Clone
                </div>
                </h2>
                <form class="ui large form" :class="{ 'error' : hasErrors}">
                <div class="ui stacked segment">

                    <div class="field">
                    <div class="ui left icon input">
                        <i class="user icon"></i>
                        <input type="email" name="email" placeholder="Email" v-model.trim="email" required>
                    </div>
                    </div>

                    <div class="field">
                    <div class="ui left icon input">
                        <i class="lock icon"></i>
                        <input type="password" name="password" placeholder="Password" v-model.trim="password" required>
                    </div>
                    </div>

                    <button class="ui fluid large black submit button" @submit.prevent="login" @click.prevent="login" :class="{ 'loading': isLoading }" >Login</button>
                </div>

                <div class="ui error message" v-if="hasErrors">
                    <p v-for="error in errors">{{ error }}</p>
                </div>

                </form>

                <div class="ui message">
                 New to Slack? <router-link to="/register">Register</router-link>
                </div>
            </div>
        </div>  
    </div>
</template>
<script>
    
    export default{
        name: 'login',
        data() {
            return {
                email: '',
                password: '',
                errors: [],
                isLoading: false
            }
        },
        computed: {
            hasErrors() {
                return this.errors.length > 0
            }
        },
        methods: {
            login() {
                console.log("login");
                if(this.isFormValid()){
                    this.isLoading = true

                    firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(user => {

                        this.$store.dispatch('setUser', user)
                        this.$router.push('/')

                        }).catch(error => {
                        this.errors.push(error.message)
                        this.isLoading = false
                    })
                }
            },
            isFormValid(){
                if(this.email.length > 0 && this.password.length > 0){
                    return true;
                }
                return false
            }
        }
    }
</script>
<style scoped>
    .login__container{
        margin-top: 40px;
    }
    .column{
        max-width: 450px;
    }
    .ui.header>.image:not(.icon), .ui.header>img{
        height: 120px;
        width: 120px;
        margin: 0;
        margin-right: -35px;
    }
    .ui.header{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: -40px;
        color: #fff;
    }

    
</style>
