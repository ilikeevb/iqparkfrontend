<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card align="center">
      <v-img
        :style="{ 'border-top': '10px solid ' + event.color }"
        :src="event.room.image"
        height="250"
      >
      </v-img>
      <v-card-title>{{ event.name }}</v-card-title>
      <v-card-text class="ma-0 pa-0" align="left">
        <div class="ma-4">
          <h3>Место: {{ event.room.type }} {{ event.room.floor }} этаж</h3>
          <h3>
            Начало: {{ convertTime(event.start) }}
            {{ convertDate(event.start) }}
          </h3>
          <h3>
            Конец: {{ convertTime(event.end) }} {{ convertDate(event.end) }}
          </h3>
        </div>
        <v-tabs
          class="tab"
          v-model="tab"
          center-active
          :background-color="event.color"
          dark
        >
          <v-tab> Участники </v-tab>
          <v-tab> Чат </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <div>
              <v-list-item two-line v-for="user in event.users" :key="user.uid">
                <v-list-item-content>
                  <v-list-item-title>{{ user.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <span>{{ user.position }}</span>
                    <span v-if="user.position"
                      >, {{ returnCompanyName(user.company) }}</span
                    >
                    <span v-else>{{ returnCompanyName(user.company) }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-tab-item>
          <v-tab-item>
            <v-row no-gutters class="messager" style="overflow-y: scroll">
              <v-col align-self="end" >
                <v-row v-if="EVENT_BY_ID">
                  <v-col align="center">
                    <div v-if="EVENT_BY_ID.messages.length == 0">
                      <h3>Пока нет сообщений</h3>
                    </div>
                    <div v-else>
                      <div
                        v-for="(message, i) in EVENT_BY_ID.messages"
                        :key="i"
                      >
                        <p
                          :class="{
                            'left-message': !myMessage(message.uid),
                            'right-message': myMessage(message.uid),
                          }"
                        >
                          <v-chip
                            v-if="!myMessage(message.uid)"
                            color="blue lighten-4"
                          >
                            {{ message.message }}
                          </v-chip>
                          <v-chip v-else color="indigo accent-2">
                            <span style="color: white">{{
                              message.message
                            }}</span>
                          </v-chip>
                        </p>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <div style="padding: 0 10px 0">
              <v-text-field
                v-model="message"
                outlined
                dense
                append-icon="mdi-send"
                @click:append="sendMessage"
              />
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error">Отменить</v-btn>
        <v-btn @click="close" color="warning">Закрыть</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["dialog", "event"],
  data() {
    return {
      tab: null,
      message: "",
    };
  },
  computed: {
    ...mapGetters(["USER"]),
    EVENT_BY_ID() {
      return this.$store.getters.EVENT_BY_ID(this.event.eventId);
    },
  },
  mounted() {
    if (!this.EVENT_BY_ID) {
      this.$store.dispatch("GET_EVENTS");
    }
    if (!this.USER) {
      this.$store.dispatch("GET_USER");
    }
    setInterval(() => {
      this.$store.dispatch("GET_EVENTS");
    }, 1000);
  },
  methods: {
    myMessage(uid) {
      if (uid == this.USER.uid) {
        return true;
      } else {
        return false;
      }
    },
    sendMessage() {
      let messages = this.EVENT_BY_ID.messages;
      messages.push({
        message: this.message,
        uid: this.USER.uid,
        name: this.USER.name,
      });
      this.$store.dispatch("SEND_MESSAGE", {
        messages: messages,
        id: this.EVENT_BY_ID.id,
      });
      this.message = "";
    },
    returnCompanyName(id) {
      this.$store.dispatch("GET_COMPANIES");
      return this.$store.getters.COMPANY_BY_ID(id).name;
    },
    close() {
      this.$emit("close");
    },
    convertDate(timestamp) {
      let date = new Date(timestamp.seconds * 1000);
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();

      const dayName = [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
      ][date.getDay()];

      if (String(day).length == 1) {
        day = "0" + day;
      }
      month = Number(month) + 1;
      if (String(month).length == 1) {
        month = "0" + month;
      }
      return day + "." + month + "." + year + " (" + dayName + ")";
    },
    convertTime(timestamp) {
      let date = new Date(timestamp.seconds * 1000);
      let hh = date.getHours();
      if (String(hh).length == 1) {
        hh = "0" + String(hh);
      }
      let mm = date.getMinutes();
      if (String(mm).length == 1) {
        mm = "0" + String(mm);
      }
      return hh + ":" + mm;
    },
  },
};
</script>

<style scoped>
.tab {
  min-width: 100%;
}
.left-message {
  text-align: left;
}
.right-message {
  text-align: right;
}
.messager {
  padding: 20px;
  height: 350px;
}
.messager::-webkit-scrollbar {
  width: 0;
}
</style>