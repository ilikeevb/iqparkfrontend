<template>
  <v-container v-if="USER" class="opensans">
    <v-row>
      <v-col>
        <v-alert v-if="!USER.verify" dense border="left" type="warning">
          Аккаунт ждет модерации.
        </v-alert>
        <v-alert
          v-if="!USER.name || !USER.company"
          dense
          border="left"
          type="warning"
        >
          Заполните профиль.
          <span @click="tab = 2" class="link">Перейти к настройкам.</span>
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-avatar color="primary" size="100">
          <h1 style="color: white">{{ USER.name[0] || USER.email[0] }}</h1>
        </v-avatar>
        <h3>
          {{ USER.email }}
          <v-icon v-if="USER.verify" color="blue">mdi-check-decagram</v-icon>
        </h3>
        <a @click="signOut">Выйти</a>
      </v-col>
    </v-row>
    <v-row justify="center" v-if="USER.type == 'admin'">
      <v-col cols="6" align="center" class="admin-info">
        <h3>Вы являетесь администратором</h3>
        <h3><router-link to="/admin">Панель управления</router-link></h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <template>
          <v-tabs v-model="tab" center-active background-color="blue" dark>
            <v-tab> Мои бронирования </v-tab>
            <v-tab> Бронирование переговорных </v-tab>
            <v-tab> Настройки </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-row v-if="USER">
                <v-col v-if="USER.events.length > 0" align="center">
                  <v-card
                    class="ma-4"
                    v-for="(event, i) in USER.events"
                    :key="i"
                    max-width="600"
                  >
                    <v-list-item three-line @click="openEvent(event)">
                      <v-list-item-avatar tile size="150" color="grey">
                        <v-img :src="event.room.image"></v-img
                      ></v-list-item-avatar>
                      <v-list-item-content align="left">
                        <div class="overline">
                          {{ convertDate(event.start) }}
                        </div>
                        <v-list-item-title class="headline">
                          {{ event.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ event.room.type }}, {{ event.room.floor }} этаж
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-col>
                <v-col v-else class="ma-4" align="center">
                  <h3>У вас пока нет запланированных переговоров</h3>
                  <a @click="tab = 1">Забронировать переговорную</a>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-container v-if="ROOMS">
                <v-row>
                  <v-col>
                    <h2 v-if="USER.favorites.length > 0" class="montserrat">Избранное</h2>
                    <v-row v-if="USER.favorites.length > 0">
                      <v-col
                        cols="12"
                        sm="6"
                        lg="4"
                        v-for="room in USER.favorites"
                        :key="room.id"
                      >
                        <v-card
                          class="ma-2"
                          elevation="5"
                          @click="goRoom(room.id)"
                        >
                          <v-list-item three-line>
                            <v-list-item-avatar tile size="100" color="grey">
                              <v-img :src="room.image"></v-img
                            ></v-list-item-avatar>
                            <v-list-item-content align="left">
                              <div class="overline">{{ room.floor }} этаж</div>
                              <v-list-item-title class="headline">
                                {{ room.type }}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                Вместимость: {{ room.max }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>

                          <v-card-actions>
                            <v-chip v-if="room.equipments.vks" class="ma-1"
                              >ВКС</v-chip
                            >
                            <v-chip v-if="room.equipments.micro" class="ma-1"
                              >Микрофоны</v-chip
                            >
                            <v-chip v-if="room.equipments.wifi" class="ma-1"
                              >WI-FI</v-chip
                            >
                            <v-chip v-if="room.equipments.led" class="ma-1"
                              >LED экран</v-chip
                            >
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                    <h2 class="montserrat">Все переговорные</h2>
                    <v-row>
                      <v-col>
                        <v-card elevation="5">
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" sm="2">
                                <v-select
                                  dense
                                  :items="[2, 6]"
                                  outlined
                                  label="Этаж"
                                />
                              </v-col>
                              <v-col cols="12" sm="4">
                                <v-text-field label="Поиск" dense outlined
                                  >Поиск</v-text-field
                                >
                              </v-col>
                              <v-col cols="12" sm="4">
                                <v-select
                                  :items="[
                                    'ВКС',
                                    'Микрофоны',
                                    'WI-FI',
                                    'LED эран',
                                  ]"
                                  attach
                                  chips
                                  dense
                                  outlined
                                  label="Оборудование"
                                  multiple
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        lg="4"
                        v-for="room in ROOMS"
                        :key="room.id"
                      >
                        <v-card
                          class="ma-2"
                          elevation="5"
                          @click="goRoom(room.id)"
                        >
                          <v-list-item three-line>
                            <v-list-item-avatar tile size="100" color="grey">
                              <v-img :src="room.image"></v-img
                            ></v-list-item-avatar>
                            <v-list-item-content align="left">
                              <div class="overline">{{ room.floor }} этаж</div>
                              <v-list-item-title class="headline">
                                {{ room.type }}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                Вместимость: {{ room.max }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>

                          <v-card-actions>
                            <v-chip v-if="room.equipments.vks" class="ma-1"
                              >ВКС</v-chip
                            >
                            <v-chip v-if="room.equipments.micro" class="ma-1"
                              >Микрофоны</v-chip
                            >
                            <v-chip v-if="room.equipments.wifi" class="ma-1"
                              >WI-FI</v-chip
                            >
                            <v-chip v-if="room.equipments.led" class="ma-1"
                              >LED экран</v-chip
                            >
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col>
                  <h2 class="montserrat">Настройки</h2>
                  <div align="left">
                    <v-btn
                      v-if="USER.apps.google.auth"
                      width="325"
                      class="ma-2"
                      color="error"
                    >
                      <v-icon>mdi-check</v-icon>
                      <span> Аккаунт привязан к с Google </span>
                    </v-btn>
                    <v-btn
                      v-else
                      width="275"
                      class="ma-2"
                      color="error"
                      style="justify-content: space-around"
                    >
                      <v-icon>mdi-google</v-icon>
                      <v-divider vertical />
                      <span>
                        Войти с Google<span style="visibility: hidden">M</span>
                      </span>
                    </v-btn>
                    <v-btn
                      v-if="USER.apps.microsoft.auth"
                      width="325"
                      class="ma-2"
                      color="primary"
                    >
                      <v-icon>mdi-check</v-icon>
                      Аккаунт привязан к Outlook
                    </v-btn>
                    <v-btn
                      v-else
                      width="275"
                      class="ma-2"
                      color="primary"
                      style="justify-content: space-around"
                    >
                      <v-icon>mdi-microsoft</v-icon>
                      <v-divider vertical />
                      Войти с Microsoft
                    </v-btn>
                  </div>
                  <div align="center">
                    <v-text-field
                      v-model="USER.name"
                      label="ФИО"
                      outlined
                    ></v-text-field>
                    <v-select
                      v-model="USER.company"
                      :items="COMPANIES"
                      :item-text="'name'"
                      :item-value="'id'"
                      outlined
                      label="Компания"
                    ></v-select>
                    <v-text-field
                      v-model="USER.position"
                      label="Должность"
                      outlined
                    ></v-text-field>
                    <v-btn @click="save" color="success">Сохранить</v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </template>
      </v-col>
    </v-row>
    <event
      v-if="selectEvent"
      :event="selectEvent"
      :dialog="eventBool"
      @close="closeEvent"
    />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import Event from "@/components/Dialogs/Event.vue";

export default {
  data() {
    return {
      tab: null,
      eventBool: false,
      selectEvent: null,
    };
  },
  components: { Event },
  computed: {
    ...mapGetters(["USER"]),
    ...mapGetters(["ROOMS"]),
    ...mapGetters(["COMPANIES"]),
  },
  methods: {
    openEvent(event) {
      this.selectEvent = event;
      this.eventBool = true;
    },
    closeEvent() {
      this.eventBool = false;
      this.selectEvent = null;
    },
    save() {
      this.$store.dispatch("SAVE_USER_INFO", this.USER);
      this.$store.dispatch("GET_USER");
      if (this.USER.company) {
        this.$store.dispatch("ADD_USER_IN_COMPANY", this.USER);
      }
    },
    roomsFilter(floor) {
      return this.ROOMS.filter((room) => {
        return Number(room.floor) == Number(floor);
      });
    },
    goRoom(roomId) {
      this.$router.push({ name: "Room", params: { id: roomId } });
    },
    signOut() {
      this.$store.dispatch("SIGN_OUT");
      this.$router.push("/");
    },
    backend() {
      this.axios
        .get("http://localhost:3000/data/", { params: { token: "dasa23" } })
        .then((response) => console.log(response));
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
  },
  mounted() {
    if (!this.USER) {
      this.$store.dispatch("GET_USER");
    }
    if (!this.ROOMS) {
      this.$store.dispatch("GET_ROOMS");
    }
    if (!this.COMPANIES) {
      this.$store.dispatch("GET_COMPANIES");
    }
  },
};
</script>

<style scoped>
.link {
  color: white;
  text-decoration: underline;
  cursor: pointer;
}
.my-title {
  text-shadow: 2px 2px 1px black;
  font-size: 24px;
}
.admin-info {
  border: 1px solid grey;
  border-radius: 5px;
}
.admin-info a {
  text-decoration: none;
}
</style>