import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';

// Define the Task type
interface Task {
  id: string;
  name: string;
  status: string;
}

const History = () => {
  const [activeTab, setActiveTab] = useState('OnProgress');
  const [tasks, setTasks] = useState<Task[]>([]); // Apply the Task[] type here

  useEffect(() => {
    // Fetch tasks based on the active tab status
    const fetchTasks = async () => {
      const response = await fetch(`http://yourapi.com/tasks?status=${activeTab}`);
      const data: Task[] = await response.json(); // Ensure the fetched data is typed as Task[]
      setTasks(data);
    };

    fetchTasks();
  }, [activeTab]);

  return (
    <View style={tw`flex-1 bg-[#f9f9f9]`}>
      <View style={tw`flex-row justify-around mt-6`}>
        <TouchableOpacity onPress={() => setActiveTab('OnProgress')}>
          <Text
            style={tw`text-lg ${
              activeTab === 'OnProgress' ? 'text-[#27AE60] font-bold' : 'text-gray-500'
            }`}>
            On Progress
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Completed')}>
          <Text
            style={tw`text-lg ${
              activeTab === 'Completed' ? 'text-[#27AE60] font-bold' : 'text-gray-500'
            }`}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`mt-4`}>
        {tasks.map((task) => (
          <View key={task.id} style={tw`p-4 bg-white mb-4`}>
            <Text style={tw`text-xl font-bold`}>{task.name}</Text>
            <Text style={tw`text-gray-600`}>Status: {task.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default History;
