import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  Box,
  IconButton,
  Checkbox,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

// Firebase設定（あなたのプロジェクトの値に置き換え）
const firebaseConfig = {
  apiKey: "AIzaSyAiZSF8QzH8JVEMTDuxscLPIWjNrgH0gj8",
  authDomain: "task-18122.firebaseapp.com",
  projectId: "task-18122",
  storageBucket: "task-18122.firebasestorage.app",
  messagingSenderId: "778099537495",
  appId: "1:778099537495:web:121eae364b65b7f6355512",
  measurementId: "G-G88X153SNB",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState("");
  const [themeColor, setThemeColor] = useState("#f5f5f5");
  const [sortType, setSortType] = useState("priority");
  const [prioritySortOrder, setPrioritySortOrder] = useState("asc");
  const [difficultySortOrder, setDifficultySortOrder] = useState("asc");
  const [key, setKey] = useState("");

  // URLから鍵を取得し、Firestoreからタスクを読み込む
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let urlKey = urlParams.get("key");
    if (!urlKey) {
      urlKey = Math.floor(10000 + Math.random() * 90000).toString(); // 5桁のランダム鍵
      window.history.replaceState(null, "", `?key=${urlKey}`);
    }
    setKey(urlKey);

    // Firestoreからタスクをリアルタイムで取得
    const unsubscribe = onSnapshot(
      doc(db, "taskLists", urlKey),
      (docSnap) => {
        if (docSnap.exists()) {
          setTasks(docSnap.data().tasks || []);
        } else {
          setTasks([]);
        }
      },
      (error) => {
        console.error("Firestoreエラー:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // タスクをFirestoreに保存
  const saveTasks = async (updatedTasks) => {
    try {
      await setDoc(doc(db, "taskLists", key), { tasks: updatedTasks });
    } catch (error) {
      console.error("保存エラー:", error);
    }
  };

  const addTasks = () => {
    const taskList = newTasks
      .split("\n")
      .map((task) => task.trim())
      .filter((task) => task);
    const newTaskItems = taskList.map((text) => ({
      text,
      completed: false,
      priority: Math.floor(Math.random() * 3) + 1,
      difficulty: Math.floor(Math.random() * 3) + 1,
      subTasks: [],
    }));
    const updatedTasks = [...tasks, ...newTaskItems];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTasks("");
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const cyclePriority = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].priority = (updatedTasks[index].priority % 3) + 1;
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const cycleDifficulty = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].difficulty = (updatedTasks[index].difficulty % 3) + 1;
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const addSubTask = (taskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subTasks.push({ text: "", completed: false });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteSubTask = (taskIndex, subTaskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subTasks.splice(subTaskIndex, 1);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleSubTaskChange = (taskIndex, subTaskIndex, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subTasks[subTaskIndex].text = value;
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleSubTaskCompletion = (taskIndex, subTaskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subTasks[subTaskIndex].completed =
      !updatedTasks[taskIndex].subTasks[subTaskIndex].completed;
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const getPriorityIcon = (priority, index) => {
    switch (priority) {
      case 1:
        return (
          <IconButton onClick={() => cyclePriority(index)}>
            <ArrowDownwardIcon sx={{ color: "#81c784" }} />
          </IconButton>
        );
      case 2:
        return (
          <IconButton onClick={() => cyclePriority(index)}>
            <ArrowForwardIcon sx={{ color: "#ffb74d" }} />
          </IconButton>
        );
      case 3:
        return (
          <IconButton onClick={() => cyclePriority(index)}>
            <ArrowUpwardIcon sx={{ color: "#e57373" }} />
          </IconButton>
        );
      default:
        return null;
    }
  };

  const getDifficultyIcon = (difficulty, index) => {
    switch (difficulty) {
      case 1:
        return (
          <IconButton onClick={() => cycleDifficulty(index)}>
            <StarBorderIcon sx={{ color: "#81c784" }} />
          </IconButton>
        );
      case 2:
        return (
          <IconButton onClick={() => cycleDifficulty(index)}>
            <StarHalfIcon sx={{ color: "#ffb74d" }} />
          </IconButton>
        );
      case 3:
        return (
          <IconButton onClick={() => cycleDifficulty(index)}>
            <StarIcon sx={{ color: "#e57373" }} />
          </IconButton>
        );
      default:
        return null;
    }
  };

  const sortTasks = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const valueA = sortType === "priority" ? a.priority : a.difficulty;
      const valueB = sortType === "priority" ? b.priority : b.difficulty;
      const order =
        sortType === "priority" ? prioritySortOrder : difficultySortOrder;
      return order === "asc" ? valueA - valueB : valueB - valueA;
    });
    setTasks(sortedTasks);
    saveTasks(sortedTasks);
  };

  return (
    <Box sx={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <Paper
        elevation={1}
        sx={{
          padding: "30px",
          borderRadius: "24px",
          backgroundColor: themeColor,
          color: "#333",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "20px", color: "#555" }}>
          タスク管理
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: "20px" }}>
          あなたの鍵: <strong>{key}</strong> (このURLを共有:{" "}
          {window.location.href})
        </Typography>

        <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <textarea
            rows={4}
            value={newTasks}
            onChange={(e) => setNewTasks(e.target.value)}
            placeholder="タスクを改行で複数入力..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <Button variant="contained" color="primary" onClick={addTasks}>
            <AddIcon />
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Box>
            <Button
              variant="outlined"
              onClick={() => {
                setSortType("priority");
                setPrioritySortOrder(
                  prioritySortOrder === "asc" ? "desc" : "asc"
                );
                sortTasks();
              }}
            >
              優先度 {prioritySortOrder === "asc" ? "↑" : "↓"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSortType("difficulty");
                setDifficultySortOrder(
                  difficultySortOrder === "asc" ? "desc" : "asc"
                );
                sortTasks();
              }}
              sx={{ marginLeft: "10px" }}
            >
              難易度 {difficultySortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </Box>
          <Select
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
          >
            <MenuItem value="#f5f5f5">ライトグレー</MenuItem>
            <MenuItem value="#ffebee">ライトレッド</MenuItem>
            <MenuItem value="#e3f2fd">ライトブルー</MenuItem>
            <MenuItem value="#e8f5e9">ライトグリーン</MenuItem>
            <MenuItem value="#fff3e0">ライトオレンジ</MenuItem>
          </Select>
        </Box>

        <Box>
          {tasks.map((task, index) => (
            <Paper key={index} sx={{ padding: "10px", marginBottom: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(index)}
                  />
                  <Box>
                    <Typography>{task.text}</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {getPriorityIcon(task.priority, index)}
                      {getDifficultyIcon(task.difficulty, index)}
                    </Box>
                  </Box>
                </Box>
                <IconButton onClick={() => deleteTask(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Box sx={{ marginTop: "10px" }}>
                <Button
                  onClick={() => addSubTask(index)}
                  variant="outlined"
                  size="small"
                >
                  サブタスク追加
                </Button>
                {task.subTasks.map((subTask, subIndex) => (
                  <Paper
                    key={subIndex}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "10px",
                      padding: "10px",
                    }}
                  >
                    <Checkbox
                      checked={subTask.completed}
                      onChange={() => toggleSubTaskCompletion(index, subIndex)}
                    />
                    <input
                      type="text"
                      value={subTask.text}
                      onChange={(e) =>
                        handleSubTaskChange(index, subIndex, e.target.value)
                      }
                      placeholder="サブタスクを入力..."
                      style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        borderRadius: "5px",
                        marginLeft: "10px",
                        flexGrow: 1,
                      }}
                    />
                    <IconButton
                      onClick={() => deleteSubTask(index, subIndex)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>

        <Box
          sx={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f1f1f1",
            borderRadius: "8px",
          }}
        >
          <Typography variant="body2">
            <ArrowDownwardIcon
              sx={{ color: "#81c784", verticalAlign: "middle" }}
            />{" "}
            低優先度
            <ArrowForwardIcon
              sx={{ color: "#ffb74d", verticalAlign: "middle" }}
            />{" "}
            中優先度
            <ArrowUpwardIcon
              sx={{ color: "#e57373", verticalAlign: "middle" }}
            />{" "}
            高優先度 /
            <StarBorderIcon
              sx={{ color: "#81c784", verticalAlign: "middle" }}
            />{" "}
            易しい
            <StarHalfIcon
              sx={{ color: "#ffb74d", verticalAlign: "middle" }}
            />{" "}
            普通
            <StarIcon sx={{ color: "#e57373", verticalAlign: "middle" }} />{" "}
            難しい
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskManager;
