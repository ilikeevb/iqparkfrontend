<template>
  <v-container>
    <v-row style="height: 100vh" justify="center" align="center">
      <v-col align="center">
        <v-card max-width="400" elevation="10">
          <v-card-title class="justify-center">
            
          </v-card-title>
          <v-card-text>
            <div>
              <v-btn
                @click="authGoogle"
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
                @click="authOutlook"
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
            <transition name="slide-fade" mode="out-in">
              <div v-if="login" key="1">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <p class="my-subtitle">или войдите в свою учетную запись</p>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Почта"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="password1"
                    :append-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="showPassword1 ? 'text' : 'password'"
                    label="Пароль"
                    outlined
                    @click:append="showPassword1 = !showPassword1"
                  ></v-text-field>
                  <v-btn
                    @click="logIn"
                    color="success"
                    :disabled="!valid"
                    large
                    width="150"
                  >
                    Войти
                  </v-btn>
                  <p class="signup">
                    Нет аккаунта?
                    <a @click="login = false">Зарегистрироваться</a>
                  </p>
                </v-form>
              </div>

              <div v-else key="2">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <p class="my-subtitle">или создайте учетную запись</p>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Почта"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="password1"
                    :append-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="showPassword1 ? 'text' : 'password'"
                    label="Пароль"
                    outlined
                    @click:append="showPassword1 = !showPassword1"
                  ></v-text-field>
                  <v-text-field
                    v-model="password2"
                    :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.emailMatch]"
                    :type="showPassword2 ? 'text' : 'password'"
                    label="Повторите пароль"
                    outlined
                    @click:append="showPassword2 = !showPassword2"
                  ></v-text-field>
                  <v-btn
                    color="success"
                    :disabled="!valid"
                    large
                    width="200"
                    @click="signUp"
                  >
                    Зарегистрироваться
                  </v-btn>
                  <p class="signup">
                    Есть аккаунта? <a @click="login = true">Войти</a>
                  </p>
                </v-form>
              </div>
            </transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      valid: true,
      login: true,
      email: "",
      showPassword1: false,
      showPassword2: false,
      password1: "",
      password2: "",
      rules: {
        required: (value) => !!value || "Обязательное поле",
        min: (value) => value.length >= 8 || "Минимум 8 символов",
        emailMatch: (value) => value == this.password1 || "Пароли не совпадают",
      },
      emailRules: [
        (v) => !!v || "Требуется электронная почта",
        (v) => /.+@.+\..+/.test(v) || "Недопустимый формат электронной почты",
      ],
    };
  },
  computed: {
    ...mapGetters(["NAME"]),
    ...mapGetters(["USER"]),
  },
  watch: {
    login() {
      this.email = "";
      this.password1 = "";
      this.password2 = "";
      this.valid = true;
    },
    USER() {
      if ("uid" in this.USER) {
        this.$router.push("user");
      }
    },
  },
  methods: {
    authGoogle() {
      this.$store.dispatch("CREATE_ACCOUNT_GOOGLE");
    },
    authOutlook() {
      console.log('authOutlook')
      this.$store.dispatch("CREATE_ACCOUNT_OUTLOOK");
    },
    logIn() {
      if (this.email.length > 0 && this.password1.length > 0) {
        this.$store.dispatch("LOGIN_ACCOUNT_EMAIL", {
          email: this.email,
          password: this.password1,
        });
      }
    },
    signUp() {
      if (this.email.length > 0 && this.password1.length > 0) {
        this.$store.dispatch("CREATE_ACCOUNT_EMAIL", {
          email: this.email,
          password: this.password1,
        });
      }
    },
  },
  mounted() {
    if (!this.USER) {
      this.$store.dispatch("GET_USER");
    }
  },
};
</script>

<style scoped>
.theme--light.v-divider {
  border-color: rgb(255, 255, 255) !important;
}
.my-title {
  font-size: 28px;
}
.my-subtitle {
  margin-top: 10px;
  font-size: 16px;
}
.signup {
  margin-top: 40px;
  font-size: 16px;
}

.slide-fade-leave-active {
  transition: all 0.4s;
}
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
