#!/bin/bash

# default value to be used when create_test_instances.sh is used by itself 

AMI=ami-0b152cfd354c4c7a4 # ubuntu 18.04
INSTANCE_TYPE=${SI_INSTANCE_TYPE:=t2.micro}
ROOT_DISK_VOLUME=${SI_ROOT_DISK_VOLUME:=8}

SECURITY_GROUP=${SECURITY_GROUP:=regionless_kv_service}

KEY_NAME=${KEY_NAME:=regionless_kv_service_key}
KEY_FILE=${KEY_FILE:=regionless_kv_service_key.pem}

INSTANCE_TAG=${SI_VM_NAME:=regionless-rkv-lab-si}
NUM_OF_INSTANCE=${NUM_OF_SI:=2}
