<template>

    <div class="messages__container">
        <div class="messages__content">
            <h2 class="ui inverted center aligned header"># Nom du channel</h2>
            <div class="ui segment">
                <div class="ui comments">
                    <!-- Composant single message-->
                    <transition-group tag="div" name="list">
                        <single-message :message="message" v-for="message in messages" :key="message.id"></single-message>
                    </transition-group>
                </div>
            </div>

        </div>

        <!-- Formulaire d'envoi-->
        <message-form></message-form>

    </div>

</template>

<script>
    import MessageForm from './MessageForm'
    import SingleMessage from './SingleMessage'
    import { mapGetters } from 'Vuex'
    export default {
        name: 'messages',
        components: { MessageForm, SingleMessage },
        data () {
            return {
                messagesRef: firebase.database().ref('messages'),
                messages: [],
                channel: null
            }
        },
        computed: {
            ...mapGetters(['currentChannel', 'currentUser'])
        },
        watch : {
            currentChannel () {
                this.messages = []
                this.detachListeners()
                this.addListeners()
                this.channel = this.currentChannel
            }
        },
        methods: {
            addListeners () {
                this.messagesRef.child(this.currentChannel.id).on('child_added', snap => {    
                    let message = snap.val()
                    message['id'] = snap.key               
                    this.messages.push(message)
                })
            },
            detachListeners () {
                if(this.channel !== null){
                    this.messagesRef.child(this.channel.id).off('child_added')
                }
            }
        },
        beforeDestroy () {
            this.detachListeners()
        }
    }
</script>

<style scoped>
    .messages__container{
        position: relative;        
        background-color: #fff;        
        padding: 10px 30px 210px 30px; 
        margin-left: 300px;
        min-height: 100%;
    }
    .messages__container .comments{
        font-size: 1.2em;
    }  
    .list-enter-active{
        transition: all 0.3s
    }  
    .list-enter, .list-leave-to{
        opacity: 0;
        transform: translateX(30px);
    }
</style>
