'use client';

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmergencyBookingOverlayProps {
  visible: boolean;
  onClose: () => void;
}

const EmergencyBookingOverlay: React.FC<EmergencyBookingOverlayProps> = ({ visible, onClose }) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Emergency Cleaning Contact</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Contact Us for Emergency Cleaning</Text>
              <View style={styles.contactItem}>
                <Ionicons name="call-outline" size={24} color="#DC143C" style={styles.icon} />
                <Text style={styles.contactText}>+977-123-456-7890</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={24} color="#DC143C" style={styles.icon} />
                <Text style={styles.contactText}>emergency@neatify.com</Text>
              </View>
              <Text style={styles.infoText}>
                Call or email us for immediate assistance with your emergency cleaning needs.
              </Text>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.closeButtonFooter} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    width: '100%',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
  },
  contactSection: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  closeButtonFooter: {
    backgroundColor: '#DC143C',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmergencyBookingOverlay;
