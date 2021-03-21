<template>
  <v-container v-if="ROOM_BY_ID" fluid fill-height class="montserrat">
    <v-row>
      <v-col class="ma-0 pa-0">
        <v-parallax
          :src="ROOM_BY_ID.image"
          class="parallax"
          height="350"
        ></v-parallax>
        <div class="ma-5">
          <v-btn @click="goUser" color="primary" text outlined>
            <v-icon>mdi-chevron-left</v-icon> Назад
          </v-btn>
          <h1>
            {{ ROOM_BY_ID.type }}, {{ ROOM_BY_ID.floor }} этаж
            <v-btn v-if="checkFavorites()" icon>
              <v-icon color="red" large>mdi-heart</v-icon>
            </v-btn>
            <v-btn v-else icon @click="addFavorite">
              <v-icon large>mdi-heart</v-icon>
            </v-btn>
          </h1>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ma-2 d-none d-md-flex">
        <table>
          <tr>
            <th>Вместимость</th>
            <th>Площадь, кв.м.</th>
            <th>Видеоконфереции</th>
            <th>Микрофоны</th>
            <th>WI-FI</th>
            <th>LED экран</th>
          </tr>
          <tr align="center">
            <td>4</td>
            <td>7.8</td>
            <td><v-icon color="green" large>mdi-check</v-icon></td>
            <td><v-icon color="green" large>mdi-check</v-icon></td>
            <td></td>
            <td><v-icon color="green" large>mdi-check</v-icon></td>
          </tr>
        </table>
      </v-col>
      <v-col class="d-flex d-md-none">
        <table>
          <tr align="center">
            <td>Вместимость</td>
            <td>4</td>
          </tr>
          <tr align="center">
            <td>Площадь, кв.м.</td>
            <td>7.8</td>
          </tr>
          <tr align="center">
            <td>Видеоконфереции</td>
            <td><v-icon color="green" large>mdi-check</v-icon></td>
          </tr>
          <tr align="center">
            <td>Микрофоны</td>
            <td><v-icon color="green" large>mdi-check</v-icon></td>
          </tr>
          <tr align="center">
            <td>WI-FI</td>
            <td></td>
          </tr>
          <tr align="center">
            <td>LED экран</td>
            <td><v-icon color="green" large>mdi-check</v-icon></td>
          </tr>
        </table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet tile height="30" class="d-flex">
          <v-spacer></v-spacer>
          <v-toolbar-title v-if="$refs.calendar">
            {{
              String($refs.calendar.title).charAt(0).toUpperCase() +
              String($refs.calendar.title).slice(1)
            }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-sheet>
        <v-sheet tile height="54" class="d-flex">
          <v-spacer></v-spacer>
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            outlined
            class="mr-4"
            color="ma-2 grey darken-2"
            @click="setToday"
          >
            Сегодня
          </v-btn>
          <v-select
            v-model="type"
            :items="types"
            :item-text="'name'"
            :item-value="'value'"
            dense
            class="time"
            outlined
          ></v-select>
          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-sheet>
        <v-sheet height="800">
          <v-calendar
            ref="calendar"
            v-model="focus"
            @click:more="viewDay"
            @click:date="viewDay"
            @click:event="showEvent"
            :weekdays="weekday"
            :type="type"
            :events="eventsWeek"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
            :event-color="getEventColor"
            :event-ripple="false"
            @change="getEvents"
            :interval-format="intervalFormat"
            :first-interval="8"
            :interval-minutes="60"
            :interval-count="13"
            @mousedown:event="startDrag"
            @mousedown:time="startTime"
            @mousemove:time="mouseMove"
            @mouseup:time="endDrag"
            @mouseleave.native="cancelDrag"
            :key="key"
          >
            <template v-slot:event="{ event, timed, eventSummary }">
              <div class="v-event-draggable" v-html="eventSummary()"></div>
              <div
                v-if="timed"
                class="v-event-drag-bottom"
                @mousedown.stop="extendBottom(event)"
              ></div>
            </template>
          </v-calendar>
          <v-menu
            v-if="selectedEvent.name == '+ Забронировать'"
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="color" dark>
                <v-spacer></v-spacer>
                <v-toolbar-title>Забронировать</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <p class="date">{{ returnFullDate(selectedEvent.start) }}</p>
                <v-text-field
                  v-model="nameEvent"
                  dense
                  outlined
                  label="Название мероприятия"
                ></v-text-field>
                <h3>Время начала</h3>
                <v-row>
                  <v-col align="right">
                    <v-select
                      v-model="hourEventStart"
                      dense
                      class="time"
                      label="ЧЧ"
                      :items="hours"
                      outlined
                    ></v-select>
                  </v-col>
                  <v-col align="left">
                    <v-select
                      v-model="minuteEventStart"
                      dense
                      class="time"
                      label="ММ"
                      :items="minutes"
                      outlined
                    ></v-select>
                  </v-col>
                </v-row>
                <h3>Время окончания</h3>
                <v-row>
                  <v-col align="right">
                    <v-select
                      v-model="hourEventEnd"
                      dense
                      class="time"
                      label="ЧЧ"
                      :items="hours"
                      outlined
                    ></v-select>
                  </v-col>
                  <v-col align="left">
                    <v-select
                      v-model="minuteEventEnd"
                      dense
                      class="time"
                      label="ММ"
                      :items="minutes"
                      outlined
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <h3>Выберите цвет</h3>
                    <v-select
                      v-model="color"
                      :items="colors"
                      :item-text="'name'"
                      :item-value="'value'"
                      dense
                      outlined
                    ></v-select>
                    <v-checkbox :label="'Пригласить сотрудников'"></v-checkbox>
                    <v-list v-if="USER.apps.microsoft.auth && !Array.isArray(OUTLOOK_CALENDAR)">
                      <v-list-group
                        v-model="active"
                        prepend-icon="mdi-microsoft"
                        no-action
                        v-if="'data' in OUTLOOK_CALENDAR"
                      >
                        <template v-slot:activator>
                          <v-list-item-content>
                            <v-list-item-title
                              >Добавить в Outlook</v-list-item-title
                            >
                          </v-list-item-content>
                        </template>

                        <v-list-item v-if="'value' in OUTLOOK_CALENDAR.data">
                          <v-list-item-content v-if="OUTLOOK_CALENDAR.data.value">
                            <v-select
                              v-model="outlookCalendarId"
                              :items="OUTLOOK_CALENDAR.data.value"
                              :item-text="'name'"
                              :item-value="'id'"
                              label="Календарь"
                              outlined
                            ></v-select>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-group>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="success"
                  @click="addEvent(selectedEvent.start)"
                >
                  Добавить
                </v-btn>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  Отмена
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Calendar",
  data() {
    return {
      outlookEvent: {},
      outlookCalendarId: null,
      active: false,
      color: "green",
      colors: [
        { value: "green", name: "Зеленый" },
        { value: "blue", name: "Синий" },
        { value: "red", name: "Красный" },
        { value: "grey", name: "Серый" },
        { value: "yellow", name: "Желтый" },
      ],
      first: true,
      nameEvent: "",
      hourEventStart: "",
      minuteEventStart: "",
      hourEventEnd: "",
      minuteEventEnd: "",
      dragEvent: null,
      dragStart: null,
      createEvent: null,
      createStart: null,
      extendOriginal: null,
      eventTemp: null,
      key: 1,
      type: "week",
      types: [
        { name: "Месяц", value: "month" },
        { name: "Неделя", value: "week" },
        { name: "День", value: "day" },
      ],
      mode: "column",
      weekday: [1, 2, 3, 4, 5, 6, 0],
      focus: "",
      eventsWeek: [],
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      hours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      minutes: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
      ],
    };
  },
  computed: {
    ...mapGetters(["USER"]),
    ...mapGetters(["OUTLOOK_CALENDAR"]),
    ROOM_BY_ID() {
      return this.$store.getters.ROOM_BY_ID(this.$route.params.id);
    },
    TIMETABLE() {
      return this.$store.getters.ROOM_EVENT_BY_ID(this.$route.params.id);
    },
  },
  mounted() {
    if (!this.ROOM_BY_ID) {
      this.$store.dispatch("GET_ROOMS");
    }
    if (!this.USER) {
      this.$store.dispatch("GET_USER");
    }
  },
  methods: {
    checkFavorites() {
      let id = this.ROOM_BY_ID.id;
      let temp = this.USER.favorites.find((favorite) => favorite.id == id);
      if (temp) {
        return true;
      } else {
        return false;
      }
    },
    addFavorite() {
      let uid = this.USER.uid;
      let favorites = this.USER.favorites;
      favorites.push({
        type: this.ROOM_BY_ID.type,
        id: this.ROOM_BY_ID.id,
        floor: this.ROOM_BY_ID.floor,
        image: this.ROOM_BY_ID.image,
        equipments: this.ROOM_BY_ID.equipments,
      });
      this.$store.dispatch("SET_USER_FAVORITES", {
        uid: uid,
        favorites: favorites,
      });
    },
    goUser() {
      this.$router.push("/user");
    },
    startDrag({ event, timed }) {
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    startTime(tms) {
      const mouse = this.toTime(tms);
      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start;
        this.dragTime = mouse - start;
      } else {
        this.createStart = this.roundTime(mouse);
        this.createEvent = {
          name: `Event #${this.events.length}`,
          color: this.rndElement(this.colors),
          start: this.createStart,
          end: this.createStart,
          timed: true,
        };
        this.events.push(this.createEvent);
      }
    },
    extendBottom(event) {
      this.createEvent = event;
      this.createStart = event.start;
      this.extendOriginal = event.end;
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms);
      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start;
        const end = this.dragEvent.end;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;
        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart);
        const max = Math.max(mouseRounded, this.createStart);
        this.createEvent.start = min;
        this.createEvent.end = max;
      }
    },
    endDrag() {
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
      this.saveEvents();
    },
    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal;
        } else {
          const i = this.events.indexOf(this.createEvent);
          if (i !== -1) {
            this.events.splice(i, 1);
          }
        }
      }
      this.createEvent = null;
      this.createStart = null;
      this.dragTime = null;
      this.dragEvent = null;
    },
    roundTime(time, down = true) {
      const roundTo = 15; // минуты
      const roundDownTime = roundTo * 60 * 1000;
      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    },
    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    },
    getEventColor(event) {
      const rgb = parseInt(event.color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return event === this.dragEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event === this.createEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event.color;
    },
    intervalFormat(interval) {
      return interval.time;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    returnFullDate(date) {
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
    getEvents({ start, end }) {
      const eventsWeek = [];
      console.log("start: ", start.day);
      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      var date = new Date();
      let n = date.getDay();
      if(n == 0) { n = 7 }
      if (Number(date.getDate()) > Number(start.day)) {
        if (n != 0) {
          n = n - 1;
        }
      } else {
        n = 0;
      }
      if (this.USER) {
        
        for (let i = n; i < days; i++) {
          let date = new Date();
          date.setDate(min.getDate() + i);
          eventsWeek.push({
            name: "+ Забронировать",
            start: date,
            end: date,
            color: "orange",
            timed: false,
          });
        }
      }
      this.ROOM_BY_ID.events.forEach(function (event) {
        if (event.start.nanoseconds != undefined) {
          event.start = event.start.toDate();
        }
        if (event.end.nanoseconds != undefined) {
          event.end = event.end.toDate();
        }
      });

      this.eventsWeek = eventsWeek.concat(this.ROOM_BY_ID.events);
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    setToday() {
      this.focus = "";
    },
    addEvent(date) {
      let start = new Date(date);
      let end = new Date(date);
      let tempstart = start.toISOString().split(":");
      let endstart = end.toISOString().split(":");

      start.setHours(this.hourEventStart);
      start.setMinutes(this.minuteEventStart);
      end.setHours(this.hourEventEnd);
      end.setMinutes(this.minuteEventEnd);

      var eventId = "",
        abd = "abcdefghijklmnopqrstuvwxyz0123456789",
        aL = abd.length;
      while (eventId.length < 15) eventId += abd[(Math.random() * aL) | 0];

      this.ROOM_BY_ID.events.push({
        eventId: eventId,
        name: this.nameEvent,
        start: start,
        end: end,
        color: this.color,
        timed: true,
        roomId: this.$route.params.id,
        owner: {
          email: this.USER.email,
          name: this.USER.name,
          company: this.USER.company,
          position: this.USER.position,
          uid: this.USER.uid,
        },
        users: [
          {
            email: this.USER.email,
            name: this.USER.name,
            company: this.USER.company,
            position: this.USER.position,
            uid: this.USER.uid,
          },
        ],
        messages: [],
      });

      this.outlookEvent = {
        Subject: this.nameEvent,
        Start: {
          DateTime: tempstart[0] + ":" + tempstart[1] + ":00",
          TimeZone: "Pacific Standard Time",
        },
        End: {
          DateTime: endstart[0] + ":" + endstart[1] + ":00",
          TimeZone: "Pacific Standard Time",
        },
      };

      this.USER.events.unshift({
        eventId: eventId,
        name: this.nameEvent,
        start: start,
        end: end,
        color: this.color,
        timed: true,
        room: {
          type: this.ROOM_BY_ID.type,
          floor: this.ROOM_BY_ID.floor,
          id: this.$route.params.id,
          image: this.ROOM_BY_ID.image,
        },
        users: [
          {
            email: this.USER.email,
            name: this.USER.name,
            company: this.USER.company,
            position: this.USER.position,
            uid: this.USER.uid,
          },
        ],
        messages: [],
      });
      this.eventTemp = {
        name: this.nameEvent,
        eventId: eventId,
        start: start,
        end: end,
        color: this.color,
        timed: true,
        room: {
          type: this.ROOM_BY_ID.type,
          floor: this.ROOM_BY_ID.floor,
          id: this.$route.params.id,
          image: this.ROOM_BY_ID.image,
        },
        owner: {
          email: this.USER.email,
          name: this.USER.name,
          company: this.USER.company,
          position: this.USER.position,
          uid: this.USER.uid,
        },
        users: [
          {
            email: this.USER.email,
            name: this.USER.name,
            company: this.USER.company,
            position: this.USER.position,
            uid: this.USER.uid,
          },
        ],
        messages: [],
      };
      this.nameEvent = "";
      this.hourEventStart = "";
      this.minuteEventStart = "";
      this.hourEventEnd = "";
      this.minuteEventEnd = "";
      this.selectedOpen = false;
      this.key += 1;
      this.saveEvents();
    },

    saveEvents() {
      let roomId = this.$route.params.id;
      let roomEvents = this.ROOM_BY_ID.events;
      let token = this.USER.apps.microsoft.token;
      if (this.outlookCalendarId) {
        console.log(this.outlookCalendarId);
        console.log(this.outlookEvent);
        this.$store.dispatch("POST_OUTLOOK_EVENT", {
          token: token,
          calendarId: this.outlookCalendarId,
          event: this.outlookEvent,
        });
      }

      
      this.$store.dispatch("SET_ROOM_EVENTS", {
        roomId: roomId,
        events: roomEvents,
      });

      let uid = this.USER.uid;
      let userEvents = this.USER.events;
      this.$store.dispatch("SET_USER_EVENTS", {
        uid: uid,
        events: userEvents,
      });

      this.$store.dispatch("CREATE_EVENT", this.eventTemp);
      
    },
  },
};
</script>

<style scoped>
.time {
  width: 80px;
}
.date {
  font-size: 18px;
  text-align: center;
  font-weight: bold;
}
table {
  border-collapse: collapse;
  border: 1px solid grey;
  table-layout: fixed;
  width: 100%;
}
th,
td {
  border: 1px solid grey;
  width: 2%; /* для safari 6 */
}
.parallax {
  width: 100% !important;
}
</style>