<template>
    <div class="comment comment__container">
        <a class="avatar">
            <img :src="message.user.avatar">
        </a>
        <div class="content" :class="{'comment__self': selfMessage(message.user)}">
            <a class="author">{{ message.user.name }}</a>
            <div class="metadata">
                <span class="date comment__date"> {{ message.timestamp | fromNow }}</span>
            </div>
            <div class="text">{{ message.content }}</div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'Vuex'
    import moment from 'moment'
    export default {
        name: 'single-message',     
        props: ['message'],
        computed: {
            ...mapGetters(['currentUser'])
        },
        methods: {
            selfMessage(user) {
                return user.id === this.currentUser.uid
            }
        },
        filters: {
            fromNow (value){
                return moment(value).fromNow()
            }
        }  
      
    }
</script>

<style scoped>
 .comment__container pre{
        font-size: 0.9em;
        background: #232323;
        
    }   
    .comment__self{
        border-left: 10px solid orange;
        padding-left: 8px;
    }
    .comment__image{
        min-height: 100px;
        margin-top: 16px;
    }
    .comment__date{
        color: #767676;
    }    
</style>
