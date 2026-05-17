import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import './style.css';
import { 
  useUserStore, 
  usePetStore, 
  usePomodoroStore, 
  useHabitStore, 
  useMemoStore, 
  useSettingsStore, 
  useHealthStore, 
  useWindowStore 
} from './stores';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

async function initApp() {
  // Initialize stores in sequence to ensure data dependency is handled
  const userStore = useUserStore();
  const settingsStore = useSettingsStore();
  const petStore = usePetStore();
  const pomodoroStore = usePomodoroStore();
  const habitStore = useHabitStore();
  const memoStore = useMemoStore();
  const healthStore = useHealthStore();
  const windowStore = useWindowStore();

  try {
    // 1. Load essential user/settings first
    await Promise.all([
      userStore.load(),
      settingsStore.load()
    ]);

    // 2. Load feature-specific stores in parallel
    await Promise.all([
      petStore.load(),
      pomodoroStore.load(),
      pomodoroStore.loadState(),
      habitStore.load(),
      memoStore.load(),
      healthStore.load(),
      windowStore.load()
    ]);
    
    console.log('All stores loaded successfully');

    // Apply saved window settings (opacity, always-on-top, position)
    await windowStore.initWindow();
  } catch (error) {
    console.error('Error initializing app stores:', error);
  }
}

initApp().then(() => {
  app.mount('#app');
});
