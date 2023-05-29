from llama_index import SimpleDirectoryReader
from llama_index.node_parser import SimpleNodeParser
from llama_index import GPTVectorStoreIndex
import os

# this function creates a knowledgebase for us
# it allows us to specify a directory where our knowledge lives
# then it reads all of the files in that directory, and stores them in a VectorStoreIndex—which makes it easy for us to query
# it saves the VectorStoreIndex to the file system so that we can query it later

def construct_base_from_directory(path):
  # iterate over each file in the directory
  for filename in os.listdir(path):
    if filename.endswith(".txt"): # or whatever file type you're using
      print(f"Loading data for the knowledge base from {filename}...")
      filepath = os.path.join(path, filename)

      # load the file and store the data in a variable called documents
      documents = SimpleDirectoryReader(filepath).load_data()

      # split the documents into chunks, and turn them into a format that will make them easy to query
      # NOTE: this step COSTS MONEY so we only want to do this once for each document we're using. it costs $0.0004 / 1k tokens, so it's fairly cheap—but be aware of what you're doing
      print(f"Creating knowledge base for {filename}.")
      index = GPTVectorStoreIndex.from_documents(documents)

      # save the resulting index to disk so that we can use it later
      print(f"Knowledge base created for {filename}. Saving to disk...")

      # create storage directory if it does not exist
      if not os.path.exists('storage'):
        os.makedirs('storage')

      index.storage_context.persist(f'storage/{filename}')  # use filename as the name of the index
