#!/bin/bash

# default value to be used when create_test_instances.sh is used by itself 
# effective values are defined in test-lab.val when run from setup_test_lab.sh

AMI=ami-0b152cfd354c4c7a4 # ubuntu 18.04
INSTANCE_TYPE=${RKV_INSTANCE_TYPE:=t2.micro}
ROOT_DISK_VOLUME=${RKV_ROOT_DISK_VOLUME:=16}

SECURITY_GROUP=${SECURITY_GROUP:=regionless_kv_service}

KEY_NAME=${KEY_NAME:=regionless_kv_service_key}
KEY_FILE=${KEY_FILE:=regionless_kv_service_key.pem}

INSTANCE_TAG=${RKV_VM_NAME:=regionless-rkv-lab-rkv}
NUM_OF_INSTANCE=1
