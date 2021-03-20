<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="floor" label="Этаж" outlined></v-text-field>
        <v-text-field v-model="type" label="Тип" outlined></v-text-field>
        <v-text-field v-model="s" label="Площадь" outlined></v-text-field>
        <v-checkbox v-model="vks" label="ВКС"></v-checkbox>
        <v-checkbox v-model="micro" label="Микрофоны"></v-checkbox>
        <v-checkbox v-model="wifi" label="wifi"></v-checkbox>
        <v-checkbox v-model="led" label="led"></v-checkbox>
        <v-text-field v-model="max" label="Макс" outlined></v-text-field>
        <v-text-field
          v-model="image"
          label="Изображение"
          outlined
        ></v-text-field>
        <v-btn @click="save">Save</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      floor: 0,
      type: "",
      image: "",
      s: 0,
      vks: false,
      micro: false,
      wifi: false,
      led: false,
      max: "",
    };
  },
  methods: {
    click() {
      this.$store.dispatch("GET_OUTLOOK_TOKEN");
    },
    save() {
      let temp = {
        floor: this.floor,
        type: this.type,
        square: this.s,
        image: this.image,
        max: this.max,
        equipments: {
          vks: this.vks,
          micro: this.micro,
          wifi: this.wifi,
          led: this.led,
        },
        events: [],
      };
      this.$store.dispatch("SAVE_ROOM", temp);
      this.floor = 0;
      this.type = "";
      this.s = 0;
      this.image = "";
      this.max = "";
      this.led = false;
      this.vks = false;
      this.micro = false;
      this.wifi = false;
    },
  },
};
</script>